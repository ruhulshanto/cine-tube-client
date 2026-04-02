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
import { User, Mail, Lock, Loader2, ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created!", { description: "You're ready to stream." });
      router.push("/login");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Registration failed. Please verify your details.";
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
    <div className="w-full max-w-[500px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-14 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col space-y-2 mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase italic">Sign Up</h1>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest opacity-70">Begin your cinematic journey.</p>
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
                    className="h-14 px-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter px-1">
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
                    className="h-14 px-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter px-1">
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
                  className="h-14 pl-14 pr-4 bg-[#333]/70 border-none rounded-lg text-white placeholder:text-zinc-500 transition-all focus:bg-[#454545] focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0 ring-offset-transparent"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter px-1">
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
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Sign Up
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-12 flex flex-col gap-4 text-sm">
        <div className="text-zinc-500">
          Already a member?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline decoration-[#e50914] underline-offset-4">
            Sign In now.
          </Link>
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed">
          Creating an account means you agree to our 
          <span className="text-blue-500 hover:underline cursor-pointer mx-1">Terms of Use</span> 
          and 
          <span className="text-blue-500 hover:underline cursor-pointer">Privacy Statement</span>.
        </p>
      </div>
    </div>
  );
}
