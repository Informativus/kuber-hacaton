"use client";

import React, { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import { clsx } from "clsx";
import apiDash from "@/services/apiDash";

interface ErrorResponse {
  error: string;
  details?: Record<string, any>;
}

export default function CreateClusterDialog() {
  const params = useParams();
  const projectId = Number(params.project);
  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<ErrorResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        setErrorMessage(null);
        await apiDash.post("k8s/cluster/new/master", {
          projectId,
          ip,
          user: username,
          password,
        });

        setTimeout(() => {
          setOpen(false);
          router.refresh();
        }, 60000);
      } catch (err: any) {
        if (err.response?.data?.error) {
          setErrorMessage(err.response.data);
        } else {
          setErrorMessage({
            error: "Неизвестная ошибка",
            details: err.toString(),
          });
        }
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="mb-4 inline-flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50">
          + Создать новый
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Создать новый кластер
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-700">
                <p className="font-semibold">{errorMessage.error}</p>
              </div>
            )}

            <div>
              <Label.Root htmlFor="ip" className="block mb-1">
                IP адрес
              </Label.Root>
              <input
                id="ip"
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <Label.Root htmlFor="username" className="block mb-1">
                Пользователь
              </Label.Root>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <Label.Root htmlFor="password" className="block mb-1">
                Пароль
              </Label.Root>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                disabled={isPending}
                className={clsx(
                  "px-4 py-2 text-white rounded",
                  isPending ? "bg-gray-400" : "bg-black hover:bg-gray-800",
                )}
              >
                {isPending ? "Создание..." : "Создать"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
