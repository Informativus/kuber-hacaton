"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import apiDash from "@/services/apiDash";
import type { Metadata } from "next";
import StatCards from "@/components/ui/StatsCard";
import { PodStatusDonut } from "@/components/ui/PodChart";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Define the query types
interface PrometheusQueryResult {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: object;
      value: [number, string];
    }>;
  };
}

interface Cluster {
  id: number;
  projectId: number;
  ip: string;
  username: string;
  type: string;
  createdAt: string;
  joinCommand: null;
  token: null;
  caCertHash: null;
}

// Define the metrics structure
interface ClusterMetrics {
  nodesCount: number;
  cpuUsage: number;
  cpuTotal: number;
  memoryUsed: number;
  memoryTotal: number;
  podsFailed: number;
  podsSucceeded: number;
  podsRunning: number;
  podsPending: number;
}

const queries = {
  nodesCount: "count(kube_node_info)",
  cpuUsage: "sum(rate(node_cpu_seconds_total{mode!=idle}[5m]))",
  cpuTotal: "sum(machine_cpu_cores)",
  memoryUsed:
    "sum(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)",
  memoryTotal: "sum(node_memory_MemTotal_bytes)",
  podsFailed: 'sum(kube_pod_status_phase{phase="Failed"})',
  podsSucceeded: 'sum(kube_pod_status_phase{phase="Succeeded"})',
  podsRunning: 'sum(kube_pod_status_phase{phase="Running"})',
  podsPending: 'sum(kube_pod_status_phase{phase="Pending"})',
};

async function executeQuery(query: string, clasterIp: string): Promise<number> {
  const URL = `/k8s/cluster/${clasterIp}/metrics?query=${query}`;
  const response = await apiDash.get<PrometheusQueryResult>(URL);

  if (
    response.data.status === "success" &&
    response.data.data.result.length > 0
  ) {
    return parseFloat(response.data.data.result[0].value[1]);
  }
  return 0;
}

async function fetchClusterMetrics(clasterIp: string): Promise<ClusterMetrics> {
  const [
    nodesCount,
    cpuUsage,
    cpuTotal,
    memoryUsed,
    memoryTotal,
    podsFailed,
    podsSucceeded,
    podsRunning,
    podsPending,
  ] = await Promise.all([
    executeQuery(queries.nodesCount, clasterIp),
    executeQuery(queries.cpuUsage, clasterIp),
    executeQuery(queries.cpuTotal, clasterIp),
    executeQuery(queries.memoryUsed, clasterIp),
    executeQuery(queries.memoryTotal, clasterIp),
    executeQuery(queries.podsFailed, clasterIp),
    executeQuery(queries.podsSucceeded, clasterIp),
    executeQuery(queries.podsRunning, clasterIp),
    executeQuery(queries.podsPending, clasterIp),
  ]);

  return {
    nodesCount,
    cpuUsage,
    cpuTotal,
    memoryUsed,
    memoryTotal,
    podsFailed,
    podsSucceeded,
    podsRunning,
    podsPending,
  };
}

interface OverviewCardData {
  title: string;
  value: number | string;
  unit?: string;
  icon?: string;
  percentage?: number;
}

function getOverviewCards(metrics: ClusterMetrics): OverviewCardData[] {
  const memoryUsagePercent = Number(
    ((metrics.memoryUsed / metrics.memoryTotal) * 100).toFixed(2),
  );
  return [
    {
      title: "Nodes",
      value: metrics.nodesCount,
      icon: "server",
    },
    {
      title: "CPU Usage",
      value: (metrics.cpuUsage * 100).toFixed(2), // Convert to percentage
      unit: "%",
      percentage: Number((metrics.cpuUsage * 100).toFixed(2)),
      icon: "cpu",
    },
    {
      title: "Memory Usage",
      value: (metrics.memoryUsed / 1024 / 1024 / 1024).toFixed(2), // Convert to GB
      unit: "GB",
      percentage: memoryUsagePercent,
      icon: "memory",
    },
    {
      title: "Successfull Pods",
      value: metrics.podsSucceeded,
      icon: "container",
    },
  ];
}

interface GaugeData {
  value: number;
  max: number;
  label: string;
  units: string;
}

function getCpuGaugeData(metrics: ClusterMetrics): GaugeData {
  return {
    value: metrics.cpuUsage * 100,
    max: 100,
    label: "CPU Usage",
    units: "%",
  };
}

function getMemoryGaugeData(metrics: ClusterMetrics): GaugeData {
  return {
    value: metrics.memoryUsed / 1024 / 1024,
    max: metrics.memoryTotal / 1024 / 1024,
    label: "Memory Usage",
    units: "MB",
  };
}

interface DonutChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

function getPodStatusDonutData(metrics: ClusterMetrics): DonutChartData {
  return {
    labels: ["Running", "Pending", "Succeeded", "Failed"],
    datasets: [
      {
        data: [
          metrics.podsRunning,
          metrics.podsPending,
          metrics.podsSucceeded,
          metrics.podsFailed,
        ],
        backgroundColor: ["#4BC0C0", "#FFCE56", "#36A2EB", "#FF6384"],
      },
    ],
  };
}

interface TimeSeriesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

interface HistoricalMetrics {
  timestamp: string;
  metrics: ClusterMetrics;
}

function getCpuUsageTimeSeries(history: HistoricalMetrics[]): TimeSeriesData {
  return {
    labels: history.map((h) => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "CPU Usage %",
        data: history.map((h) => h.metrics.cpuUsage * 100),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };
}

function getMemoryUsageTimeSeries(
  history: HistoricalMetrics[],
): TimeSeriesData {
  return {
    labels: history.map((h) => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Memory Usage (GB)",
        data: history.map((h) => h.metrics.memoryUsed / 1024 / 1024 / 1024),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };
}

function getPodStatusHistory(history: HistoricalMetrics[]): TimeSeriesData {
  return {
    labels: history.map((h) => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Running",
        data: history.map((h) => h.metrics.podsRunning),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Pending",
        data: history.map((h) => h.metrics.podsPending),
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
      },
      {
        label: "Succeeded",
        data: history.map((h) => h.metrics.podsSucceeded),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Failed",
        data: history.map((h) => h.metrics.podsFailed),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };
}

// Common chart data interfaces
interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

interface GaugeData {
  value: number;
  max: number;
  label: string;
  units: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
}

interface OverviewCardData {
  title: string;
  value: number | string;
  unit?: string;
  icon?: string;
  percentage?: number;
  trend?: "up" | "down" | "neutral";
}

interface ClusterParams {
  project: string;
  cluster: string;
}

async function getClusterId(clusterIdString: string) {
  const clusterId = Number(clusterIdString);
  console.log(clusterId);
  try {
    const result = await apiDash.post<Cluster>("k8s/cluster/getclusterbyid", {
      clusterId,
    });
    console.log(result.data);
    return result.data.ip;
  } catch (e) {
    return "1";
  }
}

export default function Metrics() {
  const params = useParams<{ project: string; cluster: string }>();
  const [clusterId, setClusterId] = useState("");
  const [metrics, setMetrics] = useState<ClusterMetrics>();
  const [error, setError] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const fixMetrics = useCallback(async (clusterIdString: string) => {
    const clusterId = Number(clusterIdString);
    const data = await apiDash.post("/k8s/cluster/metric/install", {
      clusterId,
    });
    console.log(data);
    setShouldRefetch(true); // Trigger refetch after fixing
  }, []);

  const fetchData = useCallback(async () => {
    setError(false);
    try {
      const serverClusterId = await getClusterId(params.cluster);
      setClusterId(serverClusterId);
      const serverMetrics = await fetchClusterMetrics(params.cluster);
      setMetrics(serverMetrics);
    } catch (err) {
      setError(true);
      console.error("Failed to fetch metrics:", err);
    } finally {
      setShouldRefetch(false);
    }
  }, [params.cluster]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for refetching
    const intervalId = setInterval(fetchData, 60000); // 60 seconds

    // Cleanup
    return () => clearInterval(intervalId);
  }, [shouldRefetch]);

  const overviewCards = metrics ? getOverviewCards(metrics) : null;
  const podDonut = metrics ? getPodStatusDonutData(metrics) : null;
  const [running, pending, succeeded, failed] = podDonut
    ? podDonut.datasets[0].data
    : [0, 0, 0, 0];
  const podData = {
    running: running,
    pending: pending,
    succeeded: succeeded,
    failed: failed,
  };
  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Button
          onClick={() => {
            fixMetrics(params.cluster);
          }}
        >
          Починить метрики
        </Button>
      )}
      <Button
        onClick={() => {
          setShouldRefetch(true);
        }}
      >
        Обновить значения
      </Button>
      {overviewCards && <StatCards data={overviewCards} />}
      {podDonut && <PodStatusDonut data={podData} />}
    </div>
  );
}
