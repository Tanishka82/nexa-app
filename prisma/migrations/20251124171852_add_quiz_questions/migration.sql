-- CreateEnum
CREATE TYPE "public"."QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "public"."QuestionCategory" AS ENUM ('TECHNICAL', 'BEHAVIORAL', 'SITUATIONAL', 'PROBLEM_SOLVING', 'COMMUNICATION', 'LEADERSHIP', 'GENERAL');

-- CreateTable
CREATE TABLE "public"."QuizQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" "public"."QuestionDifficulty" NOT NULL,
    "category" "public"."QuestionCategory" NOT NULL,
    "industry" TEXT NOT NULL,
    "subIndustry" TEXT,
    "skills" TEXT[],
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizQuestion_industry_category_idx" ON "public"."QuizQuestion"("industry", "category");

-- CreateIndex
CREATE INDEX "QuizQuestion_difficulty_idx" ON "public"."QuizQuestion"("difficulty");

-- CreateIndex
CREATE INDEX "QuizQuestion_isActive_idx" ON "public"."QuizQuestion"("isActive");

-- CreateIndex
CREATE INDEX "QuizQuestion_category_industry_difficulty_idx" ON "public"."QuizQuestion"("category", "industry", "difficulty");
