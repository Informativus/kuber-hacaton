'use client'
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
} from "@/components/ui/dialog"
import apiDash from "@/services/apiDash";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from 'react'

interface DeploymentProps {
  success: boolean,
  data: DeploymentData[]
}

interface DeploymentData {
    namespace: string,
    deployments: Deployments[]
}

interface Deployments {
  name: string,
  replicas: number,
  availableReplicas: number
}

async function getDeployments (clusterId: string) {
  const result = await apiDash.get<DeploymentProps>(`k8s/cluster/${clusterId}/namespaces-with-deployments`)
  const deployments = result.data.data.filter(elem => elem.deployments.length > 0).sort((a,b) => a.deployments.length - b.deployments.length)
  return deployments
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

const metrics = (namespace: string, podname: string) =>  {
  return {
    //  CPU usage (ядра)
    cpuUsage: `sum(rate(container_cpu_usage_seconds_total{namespace=${namespace}, pod=${podname}}[5m])) by (container)`,

    //  Memory usage (байты)
    memoryUsage: `sum(container_memory_working_set_bytes{namespace=${namespace}, pod=${podname}}) by (container)`,

    //  CPU limits
    cpuLimits: `kube_pod_container_resource_limits{namespace=${namespace}, pod=${podname}, resource="cpu"}`,

    //  Memory limits
    MemoryLimits: `kube_pod_container_resource_limits{namespace=${namespace}, pod=${podname}, resource="memory"}`,

    //  CPU requests
    cpuRequests: `kube_pod_container_resource_requests{namespace=${namespace}, pod=${podname}, resource="cpu"}`,

    //  Memory requests
    MemoryRequests: `kube_pod_container_resource_requests{namespace=${namespace}, pod=${podname}, resource="memory"}`,
  }
}

interface DeploymentMetrics {
  cpuUsage: number
  memoryUsage: number
  cpuLimits: number
  MemoryLimits: number
  cpuRequests: number
  MemoryRequests: number

}

async function executeQuery(query: string, clasterId: string): Promise<number> {
    const response = await apiDash.get<PrometheusQueryResult>(`/k8s/cluster/${clasterId}/metrics`, {
      params: { query },
    });

    console.log(response, response)

    if (response.data.status === 'success' && response.data.data.result.length > 0) {
      // Extract the numeric value from the result
      return parseFloat(response.data.data.result[0].value[1]);
    }
    return 0;
}

async function fetchDeploymentMetrics(namespace: string, podname: string, clasterIp: string): Promise<DeploymentMetrics> {
  const query = metrics(namespace, podname)
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
    executeQuery(query.MemoryLimits, clasterIp),
    executeQuery(query.cpuRequests, clasterIp),
    executeQuery(query.MemoryRequests, clasterIp),
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



function ModalDeploymentMetrics({ namespace, podmane, clusterId } : {namespace: string, podmane: string, clusterId: string}){
  const [metrics, setMetrics] = useState<DeploymentMetrics>()
  useEffect(() => {
    async function wrap() {
      const servermetrics = await fetchDeploymentMetrics(namespace, podmane, clusterId)
      setMetrics(servermetrics)
    }
    wrap()
  }, [])
  console.log(metrics)
  return (
    <div>{JSON.stringify(metrics)}</div>
  )
}

export default function Deployment() {

  const params = useParams<{projects: string, cluster: string}>()

  const [deployments, setDeployments] = useState<DeploymentData[]>([])

  useEffect(() => {

    async function wrap() {
      const serverDeployments = await getDeployments(params.cluster)
      setDeployments(serverDeployments)
    }

    wrap()
  }, [params.cluster])

  console.log(deployments)

  return (
    <div>
      <h2>Деплойменты</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namespace</TableHead>
            <TableHead>Deployment name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deployments.map(elem => (
            elem.deployments.map((deployment, i) => (
              <TableRow key={i}>
                <TableCell>{elem.namespace}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger>{deployment.name}</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <ModalDeploymentMetrics namespace={elem.namespace} podmane={deployment.name} clusterId={params.cluster}/>
                    </DialogContent>
                  </Dialog>
                  </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
