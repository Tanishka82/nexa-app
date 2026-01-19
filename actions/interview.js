"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache"; // ✅ Added revalidatePath

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- QUIZ ACTIONS ---

export async function generateQuiz(jobDescription = null, jobRole = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const prompt = `
      You are a technical interviewer.
      Role: ${jobRole || "Software Engineer"}
      Description: ${jobDescription || "General technical role"}
      Skills: ${user.skills ? user.skills.join(", ") : "General Tech"}
      
      Generate 10 technical multiple-choice questions.
      
      Format: JSON Array only.
      Structure: [{"question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": "a", "explanation": "..."}]
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  let improvementTip = null;
  try {
    if (score < 80) {
      const prompt = `The user scored ${score}% on a technical quiz. Provide a 1-sentence encouraging tip.`;
      const result = await model.generateContent(prompt);
      improvementTip = result.response.text().trim();
    }
  } catch (err) {
    console.error("Tip Gen Error", err);
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questions,
        category: "Technical",
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw new Error("Failed to save quiz");
  }
}

// --- VIDEO INTERVIEW ACTIONS ---

export async function generateInterview(jobDescription) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const skills = user.skills ? user.skills.join(", ") : "General soft skills";
    
    const prompt = `
      Generate 5 interview questions for a job.
      Job Description: "${jobDescription || "General Professional Role"}"
      Candidate Skills: ${skills}
      
      Requirements:
      1. Questions should be a mix of technical and behavioral.
      2. Return ONLY a JSON array of strings. 
      Example: ["Question 1?", "Question 2?"]
      
      IMPORTANT: No markdown, no "Here are your questions", just the array.
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        responseText = jsonMatch[0];
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error("Error generating interview:", error);
    return [
        "Tell me about yourself and your background.",
        "What interests you about this specific role?",
        "Describe a challenging project you worked on recently.",
        "How do you handle tight deadlines or pressure?",
        "Do you have any questions for us?"
    ];
  }
}

export async function processInterviewAnswer(question, answer) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
    You are a technical interviewer.
    Question: "${question}"
    User Answer: "${answer}"
    
    Evaluate the answer.
    Return JSON format only:
    {
      "rating": number (1-10),
      "feedback": "string (1 sentence critique)",
      "improvement": "string (1 specific tip)"
    }
  `;
  
  try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          text = jsonMatch[0];
      }

      return JSON.parse(text);
  } catch (error) {
      console.error("AI Eval Error:", error);
      return { rating: 5, feedback: "Could not evaluate.", improvement: "Please try again." };
  }
}

// ✅ NEW: Save Video Interview Results
export async function saveMockInterview(interviewData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const totalRating = interviewData.reduce((sum, q) => sum + (q.rating || 0), 0);
  const averageRating = totalRating / interviewData.length;

  try {
    const interview = await db.mockInterview.create({
      data: {
        userId: user.id,
        jobRole: "General", 
        jobDescription: "Self-Practice", 
        questions: interviewData.map(q => q.question),
        answers: interviewData.map(q => q.answer),
        feedback: interviewData.map(q => q.feedback).join(". "),
        rating: averageRating * 10, 
      },
    });

    // ✅ FORCE REFRESH: This ensures the chart updates immediately
    revalidatePath("/interview"); 
    
    return interview;
  } catch (error) {
    console.error("Error saving interview:", error);
    throw new Error("Failed to save interview");
  }
}

// ✅ UPDATED: Fetch BOTH Quiz and Interview scores
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return [];

  const quizzes = await db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const interviews = await db.mockInterview.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const combined = [
    ...quizzes.map(q => ({
      ...q,
      type: "Quiz",
      score: q.quizScore
    })),
    ...interviews.map(i => ({
      ...i,
      type: "Interview",
      score: i.rating 
    }))
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return combined;
}