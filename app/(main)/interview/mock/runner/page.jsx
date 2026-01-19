"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { generateQuiz, generateInterview } from "@/actions/interview";
import { Loader2 } from "lucide-react";
import Quiz from "@/app/(main)/interview/_components/quiz";
import VideoInterview from "@/app/(main)/interview/_components/video-interview";

export default function MockRunnerPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const jobRole = searchParams.get("role");
  const jobDesc = searchParams.get("desc");

  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (type === "quiz") {
          // ✅ FIX: Pass jobDesc and jobRole to the backend so questions are relevant
          const data = await generateQuiz(jobDesc, jobRole); 
          setQuestions(data);
        } else if (type === "video") {
          const data = await generateInterview(jobDesc);
          setQuestions(data);
        }
      } catch (error) {
        console.error("Failed to load questions", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if parameters are present or at least type is known
    if (type) fetchQuestions();
  }, [type, jobDesc, jobRole]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating your unique {type} session...</p>
      </div>
    );
  }

  if (type === "quiz") {
    return <Quiz questions={questions} />;
  }

  if (type === "video") {
    return <VideoInterview questions={questions} />;
  }

  return null;
}