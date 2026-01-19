import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performance-chart";
import Link from "next/link";
import { BrainCircuit, Video } from "lucide-react";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-6xl font-bold gradient-title mb-2">
          Interview Preparation
        </h1>
        <p className="text-muted-foreground">
          Master your interview skills with AI-driven assessments and video simulations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: AI Mock Test (Quiz) */}
        <Link
          href="/interview/mock-test"
          className="flex flex-col gap-4 p-6 rounded-lg border bg-card hover:shadow-md transition-all hover:border-primary/50 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <BrainCircuit className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">AI Mock Test</h2>
              <p className="text-sm text-muted-foreground">
                Test your knowledge with industry-specific quizzes
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Video Interview Prep */}
        <Link
          href="/interview/interview-prep"
          className="flex flex-col gap-4 p-6 rounded-lg border bg-card hover:shadow-md transition-all hover:border-primary/50 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Video className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Video Interview</h2>
              <p className="text-sm text-muted-foreground">
                Practice answering questions with real-time AI feedback
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
      </div>
    </div>
  );
}