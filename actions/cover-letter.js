"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const userResume = await db.resume.findUnique({
    where: { userId: user.id },
  });

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    About the candidate:
    - Name: ${user.name}
    - Industry: ${user.industry}
    - Skills: ${user.skills?.join(", ")}
    
    Candidate's Resume Content:
    ${userResume ? userResume.content : "Not provided"}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone.
    2. Highlight relevant skills and experience from the resume.
    3. Show understanding of the company's needs.
    4. Keep it concise (max 400 words).
    5. Use proper business letter formatting in markdown.
    
    Format the output as clean markdown text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    revalidatePath("/ai-cover-letter");
    revalidatePath(`/ai-cover-letter/${coverLetter.id}`);

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  // ✅ FIX: Assign to variable first so we can log it before returning
  const letter = await db.coverLetter.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
  });

  return letter;
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const deleted = await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/ai-cover-letter");
  return deleted;
}