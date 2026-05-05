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
    <div className="w-full max-w-xl bg-black/60 backdrop-blur-2xl ring-1 ring-white/10 border border-white/10 rounded-[2rem] p-8 md:p-14 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in duration-500 font-sans">
      <div className="flex flex-col space-y-3 mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Sign Up
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl leading-6 mx-auto md:mx-0">
          Create your account to start streaming with the Cine-Tube experience.
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
        {/* Name Pair */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="h-14 px-4 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-2xl transition-all duration-200 focus:bg-white/10 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 focus:ring-offset-0 ring-offset-transparent"
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
                    className="h-14 px-4 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-2xl transition-all duration-200 focus:bg-white/10 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/30 focus:ring-offset-0 ring-offset-transparent"
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
        </div>

        <form.Field
          name="username"
          children={(field) => (
            <div className="space-y-1.5 group">
              <div className="relative group/field transition-all duration-200">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white/5 border border-white/5 group-focus-within/field:border-[#e50914]/30">
                  <User className="w-4 h-4 text-zinc-500 group-focus-within/field:text-[#e50914] transition-colors" />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  placeholder="@username"
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
        />

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
                  placeholder="Email Address"
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
        />

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
              Sign Up
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-10 space-y-3 text-sm text-zinc-500">
        <p>
          Already a member?{" "}
          <Link
            href="/login"
            className="text-white font-semibold hover:text-[#ffb5a0] transition-colors"
          >
            Sign In now.
          </Link>
        </p>
        <p className="text-xs leading-relaxed">
          Creating an account means you agree to our
          <span className="text-blue-500 hover:underline cursor-pointer ml-1">
            Terms of Use
          </span>
          and
          <span className="text-blue-500 hover:underline cursor-pointer ml-1">
            Privacy Statement
          </span>
          .
        </p>
      </div>
    </div>
  );
}
