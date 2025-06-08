"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import CreateClusterDialog from "@/components/ui/CreateClusterButton";
import apiDash from "@/services/apiDash";

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

export default function Page() {
  const params = useParams();
  const projectId = Number(params.project);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await apiDash.post<{ collection: Cluster[] }>(
          "k8s/project/clusterlist",
          { projectId },
        );
        setClusters(res.data.collection);
      } catch {
        setClusters([]);
      }
    };
    fetchClusters();
  }, [projectId]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <CreateClusterDialog />
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Проект: {projectId}
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table className="min-w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-5 py-3">IP</TableHead>
              <TableHead className="px-5 py-3">Пользователь</TableHead>
              <TableHead className="px-5 py-3">Тип</TableHead>
              <TableHead className="px-5 py-3" />
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200">
            {clusters.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="px-5 py-3">
                  <Sheet>
                    <SheetTrigger className="underline cursor-pointer text-blue-700 hover:text-blue-500">
                      {item.ip}
                    </SheetTrigger>
                    <SheetContent className="p-5 bg-white rounded-lg shadow-lg">
                      <SheetHeader className="mb-4 pb-2 border-b border-gray-200">
                        <SheetTitle>Кластер {item.id}</SheetTitle>
                      </SheetHeader>
                      {/* дополнительные детали */}
                    </SheetContent>
                  </Sheet>
                </TableCell>

                <TableCell className="px-5 py-3">{item.username}</TableCell>
                <TableCell className="px-5 py-3">{item.type}</TableCell>

                <TableCell className="px-5 py-3">
                  <Link
                    href={`/dashboard/projects/${projectId}/${item.id}`}
                    className="text-blue-700 hover:underline"
                  >
                    Изменить
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
