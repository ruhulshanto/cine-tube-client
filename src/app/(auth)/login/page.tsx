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
    handleLoginSubmit(credentials);
  };

  return (
    <div className="w-full max-w-[420px] relative p-6 animate-in fade-in zoom-in duration-700 font-sans mx-auto">
      <div className="flex flex-col space-y-2 mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
          Sign In
        </h1>
        <p className="text-zinc-400 text-sm max-w-xs mx-auto font-medium drop-shadow-sm">
          Welcome back to Cine-Tube.
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-lg">
                  <Mail className="w-4 h-4 text-white/50 group-focus-within/field:text-white transition-colors drop-shadow-sm" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  className="h-12 pl-12 pr-4 bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 rounded-xl transition-all duration-300 focus:bg-black/60 focus:border-white/30 focus:ring-4 focus:ring-white/10 shadow-lg"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-red-400 font-bold uppercase tracking-wider px-1 drop-shadow-sm">
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-lg">
                  <Lock className="w-4 h-4 text-white/50 group-focus-within/field:text-white transition-colors drop-shadow-sm" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="h-12 pl-12 pr-4 bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 rounded-xl transition-all duration-300 focus:bg-black/60 focus:border-white/30 focus:ring-4 focus:ring-white/10 shadow-lg"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-red-400 font-bold uppercase tracking-wider px-1 drop-shadow-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {errorMsg && (
          <div className="p-3 text-xs text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl font-bold uppercase tracking-widest animate-in slide-in-from-left-2 shadow-lg">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <Checkbox
              id="remember"
              className="border-white/30 bg-black/40 backdrop-blur-md data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white transition-colors"
            />
            <label
              htmlFor="remember"
              className="text-xs font-medium text-white/70 cursor-pointer group-hover:text-white transition-colors drop-shadow-sm"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-white/70 hover:text-white transition-colors drop-shadow-sm"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-white hover:bg-zinc-200 text-black font-black h-12 text-sm uppercase tracking-[0.1em] rounded-xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all duration-300 group"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-8">
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] text-center mb-4 drop-shadow-sm">
          Quick Access (Demo)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg text-xs font-bold text-white border-white/20 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg"
            disabled={isPending}
            onClick={() => handleDemoLogin("admin")}
          >
            Admin Access
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg text-xs font-bold text-white border-white/20 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg"
            disabled={isPending}
            onClick={() => handleDemoLogin("user")}
          >
            User Access
          </Button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-white/70 text-sm font-medium drop-shadow-sm">
          New to Cine-Tube?{" "}
          <Link
            href="/register"
            className="text-white font-black hover:underline underline-offset-4 transition-all ml-1"
          >
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
}
