"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, registerUser } from "@/store/authSlice";

export default function Auth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error: reduxError, user } = useAppSelector((s) => s.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [clusterCode, setCluster] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLogin && password !== confirm) return;
    if (isLogin) {
      dispatch(loginUser({ name, password }));
    } else {
      dispatch(
        registerUser({
          name,
          password,
          confirm,
          clusterCode: clusterCode || undefined,
        }),
      );
    }
  };

  useEffect(() => {
    if (status === "idle" && user?.name) {
      router.push("/dashboard");
    }
  }, [status, user, router]);

  const showPasswordMismatch =
    !isLogin && confirm.length > 0 && password !== confirm;
  const showPasswordTooShort = password.length > 0 && password.length < 4;
  const isSubmitDisabled =
    status === "loading" || showPasswordMismatch || showPasswordTooShort;

  return (
    <div className="max-w-lg w-full mx-auto py-12 px-4">
      <div className="flex justify-center mb-6 space-x-4">
        <button
          type="button"
          className={`px-4 py-2 font-semibold ${
            isLogin ? "border-b-2 border-gray-900" : "text-gray-500"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Вход
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-semibold ${
            !isLogin ? "border-b-2 border-gray-900" : "text-gray-500"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Регистрация
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        {status === "failed" && reduxError && (
          <div className="text-red-600 text-sm">{reduxError}</div>
        )}

        <div className="flex flex-col gap-2 cursor-default">
          <Label htmlFor="name">Имя пользователя</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="username"
            required
            className="cursor-text"
          />
        </div>

        <div className="flex flex-col gap-2 cursor-default">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`cursor-text ${showPasswordTooShort ? "border-red-500" : ""}`}
          />
          {showPasswordTooShort && <p className="text-red-600 text-sm">...</p>}
        </div>

        {/* Подтверждение пароля */}
        {!isLogin && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">Повторите пароль</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className={showPasswordMismatch ? "border-red-500" : ""}
            />
            {showPasswordMismatch && (
              <p className="text-red-600 text-sm">Пароли не совпадают</p>
            )}
          </div>
        )}

        {/* Код кластера */}
        {!isLogin && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="cluster">Код кластера (опционально)</Label>
            <Input
              id="cluster"
              type="text"
              value={clusterCode}
              onChange={(e) => setCluster(e.target.value)}
              placeholder="код кластера"
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-3 text-lg font-medium"
          disabled={isSubmitDisabled}
        >
          {status === "loading"
            ? "Загрузка..."
            : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}
