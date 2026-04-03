"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/auth.services";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/zod/auth.validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ChevronRight, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (res) => {
      if (res.data?.tokens?.accessToken) {
        login(res.data.tokens.accessToken);
        toast.success("Welcome back!", { description: "Streaming starting now..." });
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Login failed. Please verify your credentials.";
      setErrorMsg(msg);
      toast.error("Auth Error", { description: msg });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMsg("");
      const validation = loginSchema.safeParse(value);
      if (!validation.success) {
        setErrorMsg("Please provide a valid email and password.");
        return;
      }
      mutate(value);
    },
  });

  return (
    <div className="w-full max-w-[450px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-14 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Sign In</h1>
        <p className="text-zinc-400 text-sm">Ready to watch? Enter your email to begin.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="email"
          children={(field) => (
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
                  className="h-14 pl-14 pr-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
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
                  className="h-14 pl-14 pr-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent outline-none"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />

        {errorMsg && (
          <div className="p-3 text-sm text-[#e50914] bg-[#e50914]/10 border-l-4 border-[#e50914] rounded-sm font-medium animate-in slide-in-from-left-2 transition-all">
            {errorMsg}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-[#e50914] hover:bg-[#b80711] text-white font-bold h-14 text-lg rounded-lg shadow-lg active:scale-[0.98] transition-all group overflow-hidden relative" 
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" className="text-white" /> Loading...
            </span>
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
               <Checkbox id="remember" className="border-zinc-500 bg-transparent data-[state=checked]:bg-[#e50914] data-[state=checked]:border-[#e50914] transition-colors" />
            </div>
            <label htmlFor="remember" className="text-xs text-zinc-500 cursor-pointer group-hover:text-zinc-400 transition-colors">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="mt-12 flex flex-col gap-4 text-sm">
        <div className="text-zinc-500">
          New to Cine-Tube?{" "}
          <Link href="/register" className="text-white font-semibold hover:underline decoration-[#e50914] underline-offset-4">
            Create an account.
          </Link>
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot. 
          <span className="text-blue-500 hover:underline cursor-pointer ml-1">Learn more.</span>
        </p>
      </div>
    </div>
  );
}
