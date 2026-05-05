"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { loginUser } from "@/services/auth.services";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/zod/auth.validation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type LoginFormValues = {
  email: string;
  password: string;
};

type AuthErrorResponse = {
  message?: string;
};

const demoCredentials = {
  admin: {
    email: "admin@cinetube.com",
    password: "Admin123",
  },
  user: {
    email: "user@example.com",
    password: "User123",
  },
} as const;

export default function LoginPage() {
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (res) => {
      if (res.data?.tokens?.accessToken) {
        login(res.data.tokens.accessToken);
        toast.success("Welcome back!", {
          description: "Streaming starting now...",
        });
      }
    },
    onError: (error: AxiosError<AuthErrorResponse>) => {
      const msg =
        error?.response?.data?.message ||
        "Login failed. Please verify your credentials.";
      setErrorMsg(msg);
      toast.error("Auth Error", { description: msg });
    },
  });

  const handleLoginSubmit = (value: LoginFormValues) => {
    setErrorMsg("");
    const validation = loginSchema.safeParse(value);
    if (!validation.success) {
      setErrorMsg("Please provide a valid email and password.");
      return;
    }
    mutate(value);
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      handleLoginSubmit(value);
    },
  });

  const handleDemoLogin = (role: keyof typeof demoCredentials) => {
    const credentials = demoCredentials[role];

    // Directly submit with demo credentials without updating form fields
    handleLoginSubmit(credentials);
  };

  return (
    <div className="w-full max-w-lg bg-black/60 backdrop-blur-2xl ring-1 ring-white/10 border border-white/10 rounded-[2rem] p-8 md:p-14 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in duration-500 font-sans">
      <div className="flex flex-col space-y-3 mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Sign In
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl leading-6">
          Ready to watch? Enter your credentials to access your dashboard
          instantly.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="email">
          {(field) => (
            <div className="space-y-1.5 group">
              <div className="relative group/field transition-all duration-200">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white/5 border border-white/5 group-focus-within/field:border-[#e50914]/30">
                  <Mail className="w-4 h-4 text-zinc-500 group-focus-within/field:text-[#e50914] transition-colors" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  placeholder="Email or phone number"
                  className="h-14 pl-14 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-2xl transition-all duration-200 focus:bg-white/10 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 focus:ring-offset-0 ring-offset-transparent"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-1.5 group">
              <div className="relative group/field transition-all duration-200">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white/5 border border-white/5 group-focus-within/field:border-[#e50914]/30">
                  <Lock className="w-4 h-4 text-zinc-400 group-focus-within/field:text-[#e50914] transition-colors" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="h-14 pl-14 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-2xl transition-all duration-200 focus:bg-white/10 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 focus:ring-offset-0 ring-offset-transparent outline-none"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {errorMsg && (
          <div className="p-3 text-sm text-[#e50914] bg-[#e50914]/10 border-l-4 border-[#e50914] rounded-2xl font-medium animate-in slide-in-from-left-2 transition-all">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#e50914] hover:bg-[#ff321f] text-white font-bold h-14 text-lg rounded-2xl shadow-[0_18px_45px_-18px_rgba(229,9,20,0.9)] active:scale-[0.98] transition-all duration-200 group overflow-hidden relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e50914]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          disabled={isPending}
        >
          {isPending ? (
            "Loading..."
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <Checkbox
                id="remember"
                className="border-zinc-500 bg-transparent data-[state=checked]:bg-[#e50914] data-[state=checked]:border-[#e50914] transition-colors"
              />
            </div>
            <label
              htmlFor="remember"
              className="text-xs text-zinc-500 cursor-pointer group-hover:text-zinc-400 transition-colors"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-2xl text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            disabled={isPending}
            onClick={() => handleDemoLogin("admin")}
          >
            Login as Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-2xl text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            disabled={isPending}
            onClick={() => handleDemoLogin("user")}
          >
            Login as User
          </Button>
        </div>
      </div>

      <div className="mt-8 text-sm text-zinc-500 space-y-3">
        <p>
          New to Cine-Tube?{" "}
          <Link
            href="/register"
            className="text-white font-semibold hover:text-[#ffb5a0] transition-colors"
          >
            Create an account.
          </Link>
        </p>
        <p className="text-xs leading-relaxed">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a
          bot.
          <span className="text-blue-500 hover:underline cursor-pointer ml-1">
            Learn more.
          </span>
        </p>
      </div>
    </div>
  );
}
