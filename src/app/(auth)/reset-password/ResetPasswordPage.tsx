/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/zod/auth.validation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
      toast.success("Password updated", {
        description: "You can now sign in with your new password.",
      });
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
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Reset Password
        </h1>
        <p className="text-zinc-400 text-sm">
          Set a new password for your account.
        </p>
      </div>

      {missingToken && (
        <div className="mb-5 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          This reset link is missing required information. Please request a new
          reset link from{" "}
          <Link
            href="/forgot-password"
            className="font-bold text-white hover:underline underline-offset-4"
          >
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
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Email"
              disabled
            />
          )}
        />

        <form.Field
          name="newPassword"
          children={(field) => (
            <Input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="New Password"
            />
          )}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <Input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Confirm Password"
            />
          )}
        />

        <form.Field
          name="token"
          children={(field) => (
            <input type="hidden" value={field.state.value} readOnly />
          )}
        />

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <Button type="submit" disabled={isPending || missingToken}>
          {isPending ? <Loader2 className="animate-spin" /> : "Reset Password"}
        </Button>
      </form>

      <Link href="/login">Back to login</Link>
    </div>
  );
}