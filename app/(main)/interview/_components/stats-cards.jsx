import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Trophy, Video } from "lucide-react";

export default function StatsCards({ assessments }) {
  const getAverageScore = (data) => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + item.score, 0);
    return (total / data.length).toFixed(1);
  };

  // Filter distinct types
  const quizzes = assessments?.filter((a) => a.type === "Quiz") || [];
  const interviews = assessments?.filter((a) => a.type === "Interview") || [];

  // Calculate separate averages
  const quizAvg = getAverageScore(quizzes);
  const interviewAvg = getAverageScore(interviews);

  // Get the absolute latest assessment (Quiz or Interview)
  // Since assessments are sorted by 'createdAt' (Oldest -> Newest), the last one is the latest.
  const latestAssessment = assessments?.[assessments.length - 1];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Card 1: Quiz Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
          <BrainCircuit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quizAvg}%</div>
          <p className="text-xs text-muted-foreground">
            Across {quizzes.length} mock tests
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Interview Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Interview Score</CardTitle>
          <Video className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviewAvg}%</div>
          <p className="text-xs text-muted-foreground">
            Across {interviews.length} video sessions
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Latest Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestAssessment ? `${latestAssessment.score.toFixed(1)}%` : "0%"}
          </div>
          <p className="text-xs text-muted-foreground">
            {latestAssessment 
                ? `Most recent ${latestAssessment.type.toLowerCase()}` 
                : "No assessments yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}