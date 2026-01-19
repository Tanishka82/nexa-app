import { getCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function CoverLetterViewPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  // If no letter is found, show this Debug UI instead of a 404
  if (!coverLetter) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          Cover Letter Not Found
        </h1>
        <div className="bg-muted p-6 rounded-lg max-w-md mx-auto text-left mb-6">
          <p className="font-mono text-sm">DEBUG INFO:</p>
          <p className="font-mono text-sm text-muted-foreground">ID Requested: {id}</p>
          <p className="font-mono text-sm text-muted-foreground">
            Database Result: null
          </p>
        </div>
        <p className="text-muted-foreground mb-6">
          This usually happens if the database is slow to save. 
          <br />Try refreshing the page.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/ai-cover-letter">
            <Button variant="outline">Go Back</Button>
          </Link>
          {/* A simple refresh button usually fixes the race condition */}
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2 mb-6">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold gradient-title">
          {coverLetter.jobTitle} at {coverLetter.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter.content} />
    </div>
  );
}