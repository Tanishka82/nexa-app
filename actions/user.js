"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  console.log("--- UPDATING USER ---");
  console.log("User ID:", user.id);
  console.log("Data:", data);

  try {
    // 1. Handle Industry Insights (Outside of Transaction to prevent timeout)
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    if (!industryInsight) {
      console.log("Generating Insights for:", data.industry);
      const insights = await generateAIInsights(data.industry);
      
      // If AI fails, use a fallback structure so we don't block user registration
      const safeInsights = insights || {
        salaryRanges: [],
        growthRate: 0,
        demandLevel: "Medium",
        topSkills: [],
        marketOutlook: "Neutral",
        keyTrends: ["Emerging Industry"],
        recommendedSkills: [],
      };

      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          ...safeInsights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
      console.log("Insights Created");
    }

    // 2. Update the User (Now safe to do)
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        industry: data.industry,
        experience: parseInt(data.experience) || 0, // Ensure Integer
        bio: data.bio,
        skills: data.skills,
      },
    });

    console.log("User Updated Successfully");

    return { updatedUser, industryInsight };
  } catch (error) {
    console.error("Error updating user and insights:", error);
    // Log the actual error message to help debugging
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const userData = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!userData?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}