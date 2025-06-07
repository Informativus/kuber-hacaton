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
  const {
    status,
    error: reduxError,
    accessToken,
    uids,
  } = useAppSelector((s) => s.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [clusterCode, setCluster] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLogin && password !== confirm) {
      return;
    }
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(
        registerUser({
          email,
          password,
          confirm,
          clusterCode: clusterCode || undefined,
        })
      );
    }
  };

  useEffect(() => {
    if (status === "idle" && accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (uids && uids.length > 0) {
        localStorage.setItem("uids", JSON.stringify(uids));
      }
      
      router.push("/dashboard");
    }
  }, [status, accessToken, uids, router]);

  const showPasswordMismatch =
    !isLogin && confirm.length > 0 && password !== confirm;
  const showPasswordTooShort = password.length > 0 && password.length < 4;
  const isSubmitDisabled =
    status === "loading" || showPasswordMismatch || showPasswordTooShort;

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="flex justify-center mb-6 space-x-4">
        <button
          type="button"
          className={`px-4 py-2 font-semibold ${
            isLogin ? "border-b-2" : "text-gray-500"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Вход
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-semibold ${
            !isLogin ? "border-b-2" : "text-gray-500"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Регистрация
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-card p-6 rounded-xl shadow"
      >
        {status === "failed" && reduxError && (
          <div className="text-red-600 text-sm">{reduxError}</div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={showPasswordTooShort ? "border-red-500" : ""}
          />
          {showPasswordTooShort && (
            <p className="mt-1 text-red-600 text-sm">
              Пароль должен быть минимум 4 символа
            </p>
          )}
        </div>

        {!isLogin && (
          <>
            <div>
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
                <p className="mt-1 text-red-600 text-sm">Пароли не совпадают</p>
              )}
            </div>

            <div>
              <Label htmlFor="cluster">Код кластера (опционально)</Label>
              <Input
                id="cluster"
                type="text"
                value={clusterCode}
                onChange={(e) => setCluster(e.target.value)}
                placeholder="код кластера"
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
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
