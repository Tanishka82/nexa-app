"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import PDFParser from "pdf2json";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ FIX: Use the latest stable model (gemini-1.5-flash is retired)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Gemini Improve Error:", error);
    throw new Error("Failed to improve content");
  }
}

export async function analyzeResumeFile(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("resume");
  if (!file) {
    throw new Error("No file uploaded");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let resumeText = "";
  try {
    const parser = new PDFParser(null, 1);

    resumeText = await new Promise((resolve, reject) => {
      parser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
      parser.on("pdfParser_dataReady", (pdfData) => {
        resolve(parser.getRawTextContent());
      });
      parser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to extract text from PDF");
  }

  if (!resumeText) {
    throw new Error("Could not read text from this PDF.");
  }

  const prompt = `
    You are an expert AI Resume Reviewer and ATS (Applicant Tracking System) scanner. 
    Analyze the following resume content against industry standards.
    
    Resume Content:
    "${resumeText}"
    
    Return a JSON object with the following structure:
    {
      "atsScore": <number 0-100>,
      "summary": <string, a concise 2 sentence summary of the candidate's profile>,
      "weaknesses": <array of strings, list 3 specific things that are missing or weak>,
      "suggestions": <array of strings, list 3 specific actionable tips to improve>
    }
    
    IMPORTANT: Return ONLY the JSON. No markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    
    const jsonString = text.replace(/^```json\n|\n```$/g, '');
    const analysis = JSON.parse(jsonString);

    return analysis;
  } catch (error) {
    console.error("Gemini Analyze Error:", error);
    throw new Error("Failed to analyze resume");
  }
}