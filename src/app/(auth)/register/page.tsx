"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/zod/auth.validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created!", {
        description: "You're ready to stream.",
      });
      router.push("/login");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        "Registration failed. Please verify your details.";
      setErrorMsg(msg);
      toast.error("Registration failed", { description: msg });
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMsg("");
      const validation = registerSchema.safeParse(value);
      if (!validation.success) {
        setErrorMsg(validation.error?.issues[0]?.message || "Validation Error");
        return;
      }
      mutate(value);
    },
  });

  return (
    <div className="w-full max-w-[440px] relative p-6 animate-in fade-in zoom-in duration-700 font-sans mx-auto">
      <div className="flex flex-col space-y-2 mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
          Create Account
        </h1>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto font-medium drop-shadow-sm">
          Join the ultimate cinematic experience.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Name Pair */}
        <div className="grid grid-cols-2 gap-3">
          <form.Field
            name="firstName"
            children={(field) => (
              <div className="space-y-1.5 group">
                <div className="relative group/field transition-all duration-200">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="First Name"
                    className="h-12 px-4 bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 rounded-xl transition-all duration-300 focus:bg-black/60 focus:border-white/30 focus:ring-4 focus:ring-white/10 shadow-lg"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[11px] text-red-400 font-bold uppercase tracking-wider px-1 drop-shadow-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="lastName"
            children={(field) => (
              <div className="space-y-1.5 group">
                <div className="relative group/field transition-all duration-200">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="Last Name"
                    className="h-12 px-4 bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 rounded-xl transition-all duration-300 focus:bg-black/60 focus:border-white/30 focus:ring-4 focus:ring-white/10 shadow-lg"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[11px] text-red-400 font-bold uppercase tracking-wider px-1 drop-shadow-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <form.Field
          name="username"
          children={(field) => (
            <div className="space-y-1.5 group">
              <div className="relative group/field transition-all duration-200">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-lg">
                  <User className="w-4 h-4 text-white/50 group-focus-within/field:text-white transition-colors drop-shadow-sm" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  placeholder="Username"
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
        />

        <form.Field
          name="email"
          children={(field) => (
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
        />

        <form.Field
          name="password"
          children={(field) => (
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
        />

        {errorMsg && (
          <div className="p-3 text-xs text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl font-bold uppercase tracking-widest shadow-lg">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-white hover:bg-zinc-200 text-black font-black h-12 text-sm uppercase tracking-[0.1em] rounded-xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all duration-300 group mt-4"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Get Started
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-10 space-y-4 text-center">
        <p className="text-white/70 text-sm font-medium drop-shadow-sm">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-white font-black hover:underline underline-offset-4 transition-all ml-1"
          >
            Sign In
          </Link>
        </p>
        <div className="h-px w-8 bg-white/20 mx-auto" />
        <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider drop-shadow-sm">
          By joining, you agree to our 
          <Link href="/terms" className="text-white/60 hover:text-white transition-colors mx-1 underline underline-offset-4">Terms</Link> 
          and 
          <Link href="/privacy" className="text-white/60 hover:text-white transition-colors ml-1 underline underline-offset-4">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
