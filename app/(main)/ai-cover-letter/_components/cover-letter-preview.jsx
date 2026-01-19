"use client";

import React, { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Download, Edit, Save, FileText, Sparkles } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

const CoverLetterPreview = ({ content }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [mdContent, setMdContent] = useState(content);
  const printRef = useRef();

  // Uses the robust react-to-print method (same as Resume Builder)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Cover_Letter",
    onAfterPrint: () => toast.success("Downloaded successfully!"),
    onPrintError: (error) => {
        console.error("Print Error:", error);
        toast.error("Download failed");
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Format: Markdown</span>
        </div>
        <div className="flex gap-2">
            <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            >
            {isEditing ? (
                <>
                <Save className="h-4 w-4 mr-2" />
                Done Editing
                </>
            ) : (
                <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
                </>
            )}
            </Button>
            
            <Button onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
            </Button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="border rounded-lg bg-background p-2">
        <MDEditor
          value={mdContent}
          onChange={setMdContent}
          preview={isEditing ? "edit" : "preview"}
          height={700}
          hideToolbar={!isEditing}
          visibleDragbar={false}
        />
      </div>

      {/* Hidden Print Area - Rendered specifically for the printer */}
      <div className="hidden">
        <div
          ref={printRef}
          className="p-10 bg-white text-black font-serif whitespace-pre-wrap"
          style={{
            lineHeight: "1.6",
            fontSize: "12pt",
            color: "#000000",
            fontFamily: "Times New Roman, serif", // Standard business font
          }}
        >
          {/* We use the markdown component to render the HTML for printing */}
          <MDEditor.Markdown 
            source={mdContent} 
            style={{ 
                background: "white", 
                color: "black",
                whiteSpace: "pre-wrap" 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;