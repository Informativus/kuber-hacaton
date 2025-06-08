"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import apiDash from "@/services/apiDash";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeploymentProps {
  success: boolean;
  data: DeploymentData[];
}

interface DeploymentData {
  namespace: string;
  deployments: Deployments[];
}

interface Deployments {
  name: string;
  replicas: number;
  availableReplicas: number;
}

async function getDeployments(clusterId: string) {
  const result = await apiDash.get<DeploymentProps>(
    `k8s/cluster/${clusterId}/namespaces-with-deployments`,
  );
  const deployments = result.data.data
    .filter((elem) => elem.deployments.length > 0)
    .sort((a, b) => a.deployments.length - b.deployments.length);
  return deployments;
}

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
const metrics = (namespace: string, podname: string) => {
  return {
    // CPU usage (more precise with pod_name label)
    cpuUsage: `sum(rate(container_cpu_usage_seconds_total{namespace="${namespace}", pod=~"${podname}", container!="POD", container!=""}[5m])) by (container)`,

    // Memory usage (exclude system containers)
    memoryUsage: `sum(container_memory_working_set_bytes{namespace="${namespace}", pod=~"${podname}", container!="POD", container!=""}) by (container)`,

    // CPU limits (using pod_name label pattern)
    cpuLimits: `kube_pod_container_resource_limits{namespace="${namespace}", pod=~"${podname}", resource="cpu", container!="POD", container!=""}`,

    // Memory limits
    memoryLimits: `kube_pod_container_resource_limits{namespace="${namespace}", pod=~"${podname}", resource="memory", container!="POD", container!=""}`,

    // CPU requests
    cpuRequests: `kube_pod_container_resource_requests{namespace="${namespace}", pod=~"${podname}", resource="cpu", container!="POD", container!=""}`,

    // Memory requests
    memoryRequests: `kube_pod_container_resource_requests{namespace="${namespace}", pod=~"${podname}", resource="memory", container!="POD", container!=""}`,
  };
}

interface DeploymentMetrics {
  cpuUsage: number;
  memoryUsage: number;
  cpuLimits: number;
  MemoryLimits: number;
  cpuRequests: number;
  MemoryRequests: number;
}

async function executeQuery(query: string, clasterId: string): Promise<number> {
    const URL = `/k8s/cluster/${clasterId}/metrics?query=${query}`
    console.log(URL)
    const response = await apiDash.get<PrometheusQueryResult>(URL);

  console.log(response, response);

  if (
    response.data.status === "success" &&
    response.data.data.result.length > 0
  ) {
    // Extract the numeric value from the result
    return parseFloat(response.data.data.result[0].value[1]);
  }
  return 0;
}

async function fetchDeploymentMetrics(
  namespace: string,
  podname: string,
  clasterIp: string,
): Promise<DeploymentMetrics> {
  const query = metrics(namespace, podname);
  // Execute all queries in parallel
  const [
    cpuUsage,
    memoryUsage,
    cpuLimits,
    MemoryLimits,
    cpuRequests,
    MemoryRequests,
  ] = await Promise.all([
    executeQuery(query.cpuUsage, clasterIp),
    executeQuery(query.memoryUsage, clasterIp),
    executeQuery(query.cpuLimits, clasterIp),
    executeQuery(query.memoryLimits, clasterIp),
    executeQuery(query.cpuRequests, clasterIp),
    executeQuery(query.memoryRequests, clasterIp),
  ]);

  return {
    cpuUsage,
    memoryUsage,
    cpuLimits,
    MemoryLimits,
    cpuRequests,
    MemoryRequests,
  };
}

async function deployCluster(clusterIdString: string, namespace :string, name:string, replicas:number) {
  await apiDash.post(`/k8s/cluster/${clusterIdString}/scale-deployment`,
    {namespace, name, replicas}
  )
}



function ModalDeploymentMetrics({ namespace, podmane, clusterId, replicas} : {namespace: string, podmane: string, clusterId: string, replicas: number}){
  const [metrics, setMetrics] = useState<DeploymentMetrics>()
  const [input, setInput] = useState('')
  useEffect(() => {
    async function wrap() {
      const servermetrics = await fetchDeploymentMetrics(
        namespace,
        podmane,
        clusterId,
      );
      setMetrics(servermetrics);
    }
    wrap()
  }, [])
  console.log(metrics)
  function handleInput(inputValue: string){
    const value = Number(inputValue)
    setInput(inputValue)
    if (value < 0) setInput(inputValue)
    if (value > 4) setInput(inputValue)
  }
  return (
    <div className="flex flex-col gap-5">
      <Input value={input} type="number" onChange={(e) => handleInput(e.target.value)}/>
      <Button onClick={() => deployCluster(clusterId, namespace, podmane, replicas)}>Изменить кол-во подов</Button>
    </div>
  )
}

export default function Deployment() {
  const params = useParams<{ projects: string; cluster: string }>();
  const [deployments, setDeployments] = useState<DeploymentData[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean | null>(null);

  useEffect(() => {
    async function wrap() {
      const serverDeployments = await getDeployments(params.cluster);
      setDeployments(serverDeployments);
    }

    wrap();
  }, [params.cluster]);

  console.log(deployments);
  const handleTestDeploy = async () => {
    setIsDeploying(true);
    setDeploySuccess(null);
    try {
      await apiDash.post("/k8s/cluster/deploy", {
        clusterId: Number(params.cluster),
      });
      setDeploySuccess(true);
    } catch (e) {
      console.error("Deploy error", e);
      setDeploySuccess(false);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div>
      <h2>Деплойменты</h2>
      <Button onClick={handleTestDeploy} disabled={isDeploying}>
        {isDeploying ? "Деплой..." : "Тестовый деплой"}
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namespace</TableHead>
            <TableHead>Deployment name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deployments.map((elem) =>
            elem.deployments.map((deployment, i) => (
              <TableRow key={i}>
                <TableCell>{elem.namespace}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger>{deployment.name}</DialogTrigger>
                    <DialogContent>
                      <ModalDeploymentMetrics namespace={elem.namespace} podmane={deployment.name} clusterId={params.cluster} replicas={deployment.replicas}/>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
