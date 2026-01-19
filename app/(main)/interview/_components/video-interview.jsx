"use client";

import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, MicOff, Video, VideoOff, Loader2, Trophy, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { processInterviewAnswer, saveMockInterview } from "@/actions/interview"; // ✅ Import saveMockInterview

export default function VideoInterview({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewData, setInterviewData] = useState([]); 
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (transcript) {
      setUserAnswer(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (currentQuestion && !isInterviewComplete) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(currentQuestion);
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    }
    return () => window.speechSynthesis.cancel();
  }, [currentQuestionIndex, currentQuestion, isInterviewComplete]);

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setUserAnswer("");
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const handleSubmitAnswer = async () => {
    if (listening) {
        SpeechRecognition.stopListening();
    }

    if (userAnswer.length < 5) {
      toast.error("Please answer the question first.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processInterviewAnswer(currentQuestion, userAnswer);
      
      if (result.rating === 0 && result.feedback.includes("Could not evaluate")) {
          toast.error("AI could not process this answer. Please clarify.");
      }
      
      setFeedback(result);
      
      setInterviewData(prev => [...prev, {
          question: currentQuestion,
          answer: userAnswer,
          feedback: result.feedback,
          rating: Number(result.rating) || 0,
          improvement: result.improvement
      }]);

    } catch (error) {
      toast.error("Failed to process answer.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ FIXED: Make this async and call saveMockInterview
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
      setUserAnswer("");
      resetTranscript();
    } else {
      // End of Interview - Save Results!
      try {
          await saveMockInterview(interviewData);
          toast.success("Interview result saved!");
      } catch (error) {
          console.error(error);
          toast.error("Failed to save interview result.");
      }
      setIsInterviewComplete(true);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold">Browser Not Supported</h2>
            <p className="text-muted-foreground text-center max-w-md">
                Your browser does not support Speech Recognition. Please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
            </p>
        </div>
    );
  }

  if (isInterviewComplete) {
      const totalScore = interviewData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      const avgScore = interviewData.length > 0 ? (totalScore / interviewData.length).toFixed(1) : "0.0";
      
      return (
          <div className="space-y-6 animate-in fade-in-50">
              <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold gradient-title">Interview Complete!</h1>
                  <p className="text-muted-foreground">Here is your performance report.</p>
              </div>

              <div className="flex justify-center">
                <Card className="w-full max-w-md bg-secondary/50 border border-primary/20 shadow-lg">
                    <CardContent className="flex flex-col items-center py-8 space-y-4">
                        <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
                        <div className="text-center">
                            <span className="text-6xl font-bold text-primary">{avgScore}/10</span>
                            <p className="text-muted-foreground mt-2 font-medium">Average Score</p>
                        </div>
                    </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                  <h3 className="text-xl font-bold">Question Breakdown</h3>
                  {interviewData.map((data, index) => (
                      <Card key={index} className="border-muted hover:border-primary/30 transition-colors">
                          <CardHeader>
                              <CardTitle className="text-base">Q{index + 1}: {data.question}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                              <div className="p-3 bg-muted rounded-md text-sm italic border-l-2 border-primary/50">
                                  "{data.answer}"
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                  <span className="font-semibold text-sm text-primary">Rating: {data.rating}/10</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{data.feedback}</p>
                              <div className="bg-green-100/30 dark:bg-green-900/20 p-3 rounded-md border border-green-200/50 dark:border-green-800/50">
                                  <p className="text-xs font-bold text-green-700 dark:text-green-400">Better Answer Tip:</p>
                                  <p className="text-xs text-green-600 dark:text-green-300">{data.improvement}</p>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
              
              <Button onClick={() => window.location.href = '/interview'} className="w-full" size="lg">
                  Back to Dashboard
              </Button>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <p className="text-xl text-muted-foreground font-medium">{currentQuestion}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-full flex flex-col justify-center items-center p-4 relative min-h-[400px]">
          {isWebcamEnabled ? (
            <Webcam
              audio={false}
              mirrored={true}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <VideoOff className="h-20 w-20 text-muted-foreground" />
              <p className="text-muted-foreground">Webcam is disabled</p>
              <Button onClick={() => setIsWebcamEnabled(true)}>Enable Camera</Button>
            </div>
          )}
          
          <div className="absolute bottom-6 flex gap-4 z-10">
             <Button
                variant={listening ? "destructive" : "default"}
                size="lg"
                className={`rounded-full w-16 h-16 shadow-lg transition-all ${listening ? 'animate-pulse ring-4 ring-red-300' : ''}`}
                onClick={toggleRecording}
             >
                {listening ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
             </Button>
          </div>
        </Card>

        <Card className="flex flex-col h-full min-h-[400px]">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="relative">
                <Textarea 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Click the microphone to record, or type your answer here..."
                    className="h-[200px] resize-none focus:ring-primary/20"
                    disabled={isProcessing}
                />
                {listening && (
                    <span className="absolute bottom-2 right-2 text-xs text-red-500 animate-pulse font-semibold">
                        🔴 Recording...
                    </span>
                )}
            </div>

            {feedback && (
                <div className="p-4 bg-secondary/50 border border-primary/20 rounded-lg space-y-2 animate-in fade-in-50">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-primary">AI Feedback</h4>
                        <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                            Rating: {feedback.rating}/10
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                    <div className="p-2 bg-green-100/30 dark:bg-green-900/20 rounded border border-green-200/50">
                        <p className="text-xs font-bold text-green-700 dark:text-green-400">💡 Tip:</p>
                        <p className="text-xs text-green-600 dark:text-green-300">{feedback.improvement}</p>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            {!feedback && (
                <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!userAnswer.trim() || isProcessing}
                    className="w-full"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" /> 
                            Evaluating...
                        </>
                    ) : "Submit Answer"}
                </Button>
            )}
            
            {feedback && (
                <Button onClick={handleNext} className="w-full">
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}