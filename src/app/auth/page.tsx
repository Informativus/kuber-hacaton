"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface IAuthProp {}

const Auth: React.FC<IAuthProp> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white dark:bg-card p-6 shadow-md"
      >
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
          />
        </div>

        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
};

export default Auth;
