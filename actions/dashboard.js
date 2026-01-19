"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the "${industry}" industry and provide insights in ONLY the following JSON format:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "HIGH" | "MEDIUM" | "LOW",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // ✅ DEBUG LOG: See exactly what AI returned
    console.log("AI Raw Response:", text.substring(0, 100) + "..."); 

    // ✅ FIX: Surgically extract JSON (removes markdown, intros, outros)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
    }
    
    const cleanedText = jsonMatch[0];
    const data = JSON.parse(cleanedText);

    return data;
  } catch (error) {
    console.error("Error generating insights:", error);
    return null;
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // ✅ SELF-HEALING: Delete empty insights so we can try again
  if (user.industryInsight && user.industryInsight.salaryRanges.length === 0) {
      console.log("Deleting empty insights to regenerate...");
      await db.industryInsight.delete({
          where: { industry: user.industry },
      });
      user.industryInsight = null;
  }

  // Generate if missing
  if (!user.industryInsight) {
    console.log("Generating new insights for:", user.industry);
    const insights = await generateAIInsights(user.industry);
    
    if (!insights) {
        return null;
    }

    // ✅ FIX: Force Uppercase Enums
    const optimizedData = {
        ...insights,
        demandLevel: insights.demandLevel.toUpperCase(), 
        marketOutlook: insights.marketOutlook.toUpperCase(),
    };

    try {
        const industryInsight = await db.industryInsight.create({
          data: {
            industry: user.industry,
            ...optimizedData,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
          },
        });
        return industryInsight;
    } catch (dbError) {
        // Recovery: If it exists but wasn't linked, fetch it
        if (dbError.code === 'P2002') { 
            return await db.industryInsight.findUnique({
                where: { industry: user.industry }
            });
        }
        console.error("Database Error:", dbError);
        return null;
    }
  }

  return user.industryInsight;
}