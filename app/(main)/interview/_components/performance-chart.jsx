"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/50 p-4 rounded-xl shadow-xl backdrop-blur-md">
        {/* Label now shows Date AND Time so you can distinguish points */}
        <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">{payload[0].value}%</span>
          <span className="text-xs text-muted-foreground">Score</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ assessments }) {
  const [activeTab, setActiveTab] = useState("Quiz");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const filtered = assessments.filter((a) => a.type === activeTab);

      const formattedData = filtered
        .map((assessment) => ({
          date: format(new Date(assessment.createdAt), "MMM dd"),
          // ✅ UNIQUE KEY: Includes time so multiple tests on same day don't overlap
          fullDate: format(new Date(assessment.createdAt), "MMM dd, p"), 
          score: assessment.score,
        }))
        .reverse();

      setChartData(formattedData);
    }
  }, [assessments, activeTab]);

  const chartColor = activeTab === "Quiz" ? "#2563eb" : "#8b5cf6";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Performance Trend
            </CardTitle>
            <CardDescription>
              Viewing {activeTab === "Quiz" ? "Mock Quiz" : "Video Interview"} scores over time
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border">
            <Button
              variant={activeTab === "Quiz" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("Quiz")}
              className={activeTab === "Quiz" ? "shadow-sm" : "text-muted-foreground"}
            >
              Mock Quiz
            </Button>
            <Button
              variant={activeTab === "Interview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("Interview")}
              className={activeTab === "Interview" ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm" : "text-muted-foreground"}
            >
              Video Interview
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                
                <XAxis 
                  dataKey="fullDate" // ✅ Use the UNIQUE key (Date + Time)
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => value.split(",")[0]} // ✅ Only show Date on Axis
                  dy={10}
                />
                
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                  dx={-10}
                />

                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '4 4' }} 
                />
                
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={chartColor}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartColor, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No {activeTab.toLowerCase()} data available yet. Start practicing!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}