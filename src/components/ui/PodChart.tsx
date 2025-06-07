"use client";

import { Doughnut } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PodStatusData {
  running: number;
  pending: number;
  succeeded: number;
  failed: number;
}

interface PodStatusDonutProps {
  data: PodStatusData;
  className?: string;
}

export function PodStatusDonut({ data, className }: PodStatusDonutProps) {
  const chartData = {
    labels: ["Running", "Pending", "Succeeded", "Failed"],
    datasets: [
      {
        data: [data.running, data.pending, data.succeeded, data.failed],
        backgroundColor: [
          "#4ade80", // green-400
          "#fbbf24", // amber-400
          "#60a5fa", // blue-400
          "#f87171", // red-400
        ],
        borderColor: [
          "#16a34a", // green-600
          "#d97706", // amber-600
          "#2563eb", // blue-600
          "#dc2626", // red-600
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (acc: number, curr: number) => acc + curr,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pod Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64">
            <Doughnut data={chartData} options={options} />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
              <PlayCircle className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm font-medium">Running</span>
              <span className="ml-auto font-bold">{data.running}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
              <Clock className="w-4 h-4 mr-2 text-amber-600" />
              <span className="text-sm font-medium">Pending</span>
              <span className="ml-auto font-bold">{data.pending}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
              <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium">Succeeded</span>
              <span className="ml-auto font-bold">{data.succeeded}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
              <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-sm font-medium">Failed</span>
              <span className="ml-auto font-bold">{data.failed}</span>
            </div>
            <div className="pt-4 mt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Pods</span>
                <span className="font-bold">
                  {data.running + data.pending + data.succeeded + data.failed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}