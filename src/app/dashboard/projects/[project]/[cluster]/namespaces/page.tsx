"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import { clsx } from "clsx";
import { Plus, Trash2 } from "lucide-react";
import apiDash from "@/services/apiDash";

interface DeleteNamespaceServerRes {
  success: boolean;
  message: string;
}
interface Namespace {
  name: string;
  podsCount: number;
  nodesCount: number;
  statuses: Record<string, number>;
}

export default function Namespaces() {
  const queryClient = useQueryClient();
  const params = useParams();
  const clusterId = params.cluster;
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: namespaces, isLoading } = useQuery<Namespace[]>({
    queryKey: ["namespaces", clusterId],
    queryFn: async () => {
      const res = await apiDash.get(`k8s/cluster/${clusterId}/namespaces`);
      return res.data;
    },
    enabled: !!clusterId,
  });

  const createMutation = useMutation({
    mutationFn: async (name: string): Promise<void> => {
      await apiDash.post(`k8s/cluster/${clusterId}/namespaces`, {
        namespace: name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["namespaces", clusterId] });
      setDialogOpen(false);
      setNewName("");
    },
    onError: (error: unknown) => {
      console.error("Ошибка при создании namespace:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (name: string): Promise<DeleteNamespaceServerRes> => {
      const result = await apiDash.delete<DeleteNamespaceServerRes>(
        `k8s/cluster/${clusterId}/namespaces/${name}`,
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));

      return result.data;
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["namespaces", clusterId] });
      } else {
        console.warn("Удаление не выполнено:", result.message);
      }
    },
    onError: (error: unknown) => {
      console.error("Ошибка при удалении namespace:", error);
    },
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Create button and dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Создать Namespace
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Новый Namespace
            </Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(newName);
              }}
              className="space-y-4"
            >
              <div>
                <Label.Root htmlFor="namespace" className="block mb-1">
                  Название
                </Label.Root>
                <input
                  id="namespace"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2">
                    Отмена
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={createMutation.status === "pending"}
                  className={clsx(
                    "px-4 py-2 text-white rounded",
                    createMutation.status === "pending"
                      ? "bg-gray-400"
                      : "bg-black hover:bg-gray-800",
                  )}
                >
                  {createMutation.status === "pending"
                    ? "Сохранение..."
                    : "Создать"}
                </button>
              </div>
              {createMutation.isError && (
                <p className="text-red-600">
                  Ошибка создания, попробуйте ещё раз
                </p>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Table */}
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2">Pods</th>
            <th className="px-4 py-2">Nodes</th>
            <th className="px-4 py-2">Statuses</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {namespaces?.map((ns) => (
            <tr key={ns.name} className="border-t">
              <td className="px-4 py-2">{ns.name}</td>
              <td className="px-4 py-2 text-center">{ns.podsCount}</td>
              <td className="px-4 py-2 text-center">{ns.nodesCount}</td>
              <td className="px-4 py-2 text-sm">
                {Object.entries(ns.statuses).map(([status, count]) => (
                  <span key={status} className="mr-2">
                    {status}: {count}
                  </span>
                ))}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => deleteMutation.mutate(ns.name)}
                  disabled={deleteMutation.status === "pending"}
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Удалить namespace"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleteMutation.status === "pending"
                    ? "Удаление..."
                    : "Удалить"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteMutation.isError && (
        <p className="text-red-600">Ошибка удаления, попробуйте ещё раз</p>
      )}
    </div>
  );
}
