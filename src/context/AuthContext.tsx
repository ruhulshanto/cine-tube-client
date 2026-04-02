"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { getCookie, removeCookie, setCookie } from "@/lib/cookieUtils";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/user.services";

interface User {
  id: string;
  userId?: string; // Add userId to match backend JWT
  email: string;
  role: "ADMIN" | "USER";
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string | null;
  profileImage?: string | null;
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setProfileImage: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PROFILE_CACHE_KEY = "userProfileCache";

type CachedProfile = {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string | null;
  profileImage?: string | null;
};

const buildDisplayName = (u: Partial<User>) => {
  return (
    [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
    u.username ||
    u.name ||
    (u.email ? u.email.split("@")[0] : "")
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const decodeAndSetUser = (token: string) => {
    try {
      if (!token || token === "undefined") {
        setIsLoading(false);
        return;
      }
      const decoded: User = jwtDecode(token);
      
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token expired. Clearing session.");
        logout();
        return;
      }

      let cached: CachedProfile | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(PROFILE_CACHE_KEY);
          cached = raw ? (JSON.parse(raw) as CachedProfile) : null;
        } catch {
          cached = null;
        }
      }

      const merged = {
        ...decoded,
        id: decoded.id || decoded.userId || "",
        username: cached?.email === decoded.email ? cached?.username : undefined,
        firstName: cached?.email === decoded.email ? cached?.firstName : undefined,
        lastName: cached?.email === decoded.email ? cached?.lastName : undefined,
        avatar: cached?.email === decoded.email ? cached?.avatar : undefined,
        profileImage: cached?.email === decoded.email ? cached?.profileImage : undefined,
      } as User;

      setUser({
        ...merged,
        name: buildDisplayName(merged),
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Auth decoding error:", error);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await getCurrentUser();
      const u = res.data;
      if (!u) return;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              id: u.id,
              email: u.email,
              role: u.role,
              username: u.username ?? prev.username,
              firstName: u.firstName ?? prev.firstName,
              lastName: u.lastName ?? prev.lastName,
              name: buildDisplayName({
                firstName: u.firstName ?? prev.firstName,
                lastName: u.lastName ?? prev.lastName,
                username: u.username ?? prev.username,
                name: prev.name,
                email: u.email ?? prev.email,
              }),
              avatar: u.avatar ?? prev.avatar,
              profileImage: u.profileImage ?? prev.profileImage,
            }
          : prev
      );
      if (typeof window !== "undefined") {
        const payload: CachedProfile = {
          id: u.id,
          email: u.email,
          username: u.username ?? undefined,
          firstName: u.firstName ?? undefined,
          lastName: u.lastName ?? undefined,
          name:
            [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
            u.username ||
            undefined,
          avatar: u.avatar ?? null,
          profileImage: u.profileImage ?? null,
        };
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(payload));
      }
    } catch {
      // Silent fail: auth token is still source of truth for login state.
    }
  };

  useEffect(() => {
    const hydrate = () => {
      const token = getCookie("accessToken") || localStorage.getItem("accessToken");
      if (token && token !== "undefined") {
        decodeAndSetUser(token);
        void refreshProfile();
      } else {
        setIsLoading(false);
      }
    };

    hydrate();
    
    window.addEventListener("focus", hydrate);
    return () => window.removeEventListener("focus", hydrate);
  }, []);

  const login = (token: string) => {
    toast.dismiss();
    setCookie("accessToken", token);
    localStorage.setItem("accessToken", token); // Redundant fallback for refresh resilience
    decodeAndSetUser(token);
    void refreshProfile();
    router.push("/");
    router.refresh();
  };

  const setProfileImage = (url: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, profileImage: url };
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(PROFILE_CACHE_KEY);
          const cached = raw ? (JSON.parse(raw) as CachedProfile) : null;
          localStorage.setItem(
            PROFILE_CACHE_KEY,
            JSON.stringify({
              ...(cached ?? {}),
              id: next.id,
              email: next.email,
              username: next.username,
              firstName: next.firstName,
              lastName: next.lastName,
              name: next.name,
              avatar: next.avatar ?? null,
              profileImage: url,
            })
          );
        } catch {
          // no-op
        }
      }
      return next;
    });
  };

  const logout = () => {
    toast.dismiss();
    setUser(null);
    removeCookie("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem(PROFILE_CACHE_KEY);
    setIsLoading(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
        setProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
