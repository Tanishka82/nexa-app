"use client";

import { FileText, Search } from "lucide-react";
import ResumeBuilder from "./_components/resume-builder";
import ResumeAnalyzer from "./_components/resume-analyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResumePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        {/* ✅ Updated: "Steel Silver" Gradient
            - Light Mode: Darker Slate -> Lighter Slate -> Darker Slate (Metallic sheen)
            - Dark Mode: Bright Slate -> Medium Slate -> Bright Slate (Platinum look)
        */}
        <h1 className="text-5xl font-bold mb-2 md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-slate-600 via-slate-400 to-slate-600 dark:from-slate-100 dark:via-slate-400 dark:to-slate-100 pb-2">
          Resume Toolkit
        </h1>
        <p className="text-muted-foreground">
          Create a professional resume or check your existing one for ATS
          compatibility.
        </p>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume Builder
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Resume Analyzer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <ResumeBuilder />
        </TabsContent>

        <TabsContent value="analyzer" className="mt-6">
          <ResumeAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
}