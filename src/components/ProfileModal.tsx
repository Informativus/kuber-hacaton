"use client";

import { UserInterface } from "@/services/authApi";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: Props) {
  const [username, setUsername] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}",
    ) as UserInterface;
    if (user?.name) setUsername(user.name);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setStatus("success");
      setMessage("Пароль успешно изменён");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setStatus("error");
      setMessage("Ошибка при смене пароля");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/auth");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-6">Профиль</h1>

        <p className="mb-6">
          <span className="font-medium">Никнейм:</span> {username || "—"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="old" className="block text-sm font-medium mb-1">
              Старый пароль
            </label>
            <input
              id="old"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <label htmlFor="new" className="block text-sm font-medium mb-1">
              Новый пароль
            </label>
            <input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-2 font-medium rounded-xl transition ${
              status === "loading"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {status === "loading" ? "Сохраняем…" : "Сменить пароль"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2 font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
          Выйти
        </button>

        {status === "success" && (
          <p className="mt-4 text-green-600 text-center">{message}</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-600 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
