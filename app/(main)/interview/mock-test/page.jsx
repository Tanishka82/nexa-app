"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MockTestPage() {
  const router = useRouter();
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const startQuiz = () => {
    if (!jobRole || !jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    const params = new URLSearchParams({
        role: jobRole,
        desc: jobDescription,
        type: "quiz" // ✅ FORCE TYPE QUIZ
    });

    router.push(`/interview/mock/runner?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Link href="/interview">
        <Button variant="link" className="gap-2 pl-0 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Interview Dashboard
        </Button>
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-title">AI Mock Test</h1>
        <p className="text-muted-foreground">
          Test your technical knowledge with an AI-generated quiz tailored to your job description.
        </p>
      </div>

      <div className="max-w-2xl mx-auto border p-6 rounded-lg bg-background shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Role / Title</label>
          <Input 
            placeholder="e.g. Full Stack Developer" 
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description / Tech Stack</label>
          <Textarea 
            placeholder="Paste the job description here..." 
            className="h-40"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={startQuiz}>
            <BrainCircuit className="h-4 w-4 mr-2" />
            Start Mock Test
        </Button>
      </div>
    </div>
  );
}