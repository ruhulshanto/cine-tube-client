"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/zod/auth.validation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");

  const preset = useMemo(() => {
    return {
      email: sp.get("email") ?? "",
      token: sp.get("token") ?? "",
    };
  }, [sp]);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setErrorMsg("");
      toast.success("Password updated", { description: "You can now sign in with your new password." });
      router.push("/login");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password. Please request a new reset link.";
      setErrorMsg(msg);
      toast.error("Request failed", { description: msg });
    },
  });

  const form = useForm({
    defaultValues: {
      email: preset.email,
      token: preset.token,
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMsg("");
      const validation = resetPasswordSchema.safeParse(value);
      if (!validation.success) {
        setErrorMsg(validation.error.issues[0]?.message || "Validation error");
        return;
      }
      mutate({
        email: value.email,
        token: value.token,
        newPassword: value.newPassword,
      });
    },
  });

  const missingToken = !preset.token || !preset.email;

  return (
    <div className="w-full max-w-[500px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-14 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Reset Password</h1>
        <p className="text-zinc-400 text-sm">
          Set a new password for your account.
        </p>
      </div>

      {missingToken && (
        <div className="mb-5 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          This reset link is missing required information. Please request a new reset link from{" "}
          <Link href="/forgot-password" className="font-bold text-white hover:underline underline-offset-4">
            Forgot Password
          </Link>
          .
        </div>
      )}

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
            <div className="space-y-1.5">
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
                  placeholder="Email address"
                  disabled={!!preset.email}
                  className="h-14 pl-14 pr-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent disabled:opacity-70"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <form.Field
          name="newPassword"
          children={(field) => (
            <div className="space-y-1.5">
              <div className="relative group/field transition-all duration-200">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white/5 border border-white/5 group-focus-within/field:border-[#e50914]/30">
                  <Lock className="w-4 h-4 text-zinc-500 group-focus-within/field:text-[#e50914] transition-colors" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  placeholder="New password"
                  className="h-14 pl-14 pr-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <div className="space-y-1.5">
              <div className="relative group/field transition-all duration-200">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white/5 border border-white/5 group-focus-within/field:border-[#e50914]/30">
                  <Lock className="w-4 h-4 text-zinc-500 group-focus-within/field:text-[#e50914] transition-colors" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  placeholder="Confirm password"
                  className="h-14 pl-14 pr-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-orange-400 font-medium px-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        {/* token stays hidden but validated */}
        <form.Field
          name="token"
          children={(field) => (
            <input
              type="hidden"
              name={field.name}
              value={field.state.value}
              readOnly
            />
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
          disabled={isPending || missingToken}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Set New Password
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-10 text-sm text-zinc-500">
        Back to{" "}
        <Link
          href="/login"
          className="text-white font-semibold hover:underline decoration-[#e50914] underline-offset-4"
        >
          Sign in
        </Link>
        .
      </div>
    </div>
  );
}

