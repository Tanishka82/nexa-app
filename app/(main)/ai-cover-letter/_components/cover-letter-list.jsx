"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { toast } from "sonner";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this cover letter?")) {
      try {
        await deleteCoverLetter(id);
        toast.success("Cover letter deleted successfully!");
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete cover letter");
      }
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first tailored cover letter to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coverLetters.map((letter) => (
        <Card key={letter.id} className="group relative hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="truncate">{letter.jobTitle}</CardTitle>
            <CardDescription className="truncate">{letter.companyName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Created {format(new Date(letter.createdAt), "PPP")}
            </div>
            <div className="flex justify-between">
              {/* ✅ FIXED: Ensures button redirects to the correct folder 'ai-cover-letter' */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(letter.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}