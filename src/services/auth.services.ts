import { httpClient } from "@/lib/axios/httpClient";
import { AuthResponse } from "@/types/auth.types";
import { removeCookie } from "@/lib/cookieUtils";

export const loginUser = async (data: any) => {
  return httpClient.post<AuthResponse>("auth/login", data);
};

export const registerUser = async (data: any) => {
  return httpClient.post<AuthResponse>("auth/register", data);
};

export const forgotPassword = async (data: { email: string }) => {
  return httpClient.post<{ message?: string }>("auth/forgot-password", data);
};

export const resetPassword = async (data: { email: string; token: string; newPassword: string }) => {
  return httpClient.post<{ message?: string }>("auth/reset-password", data);
};

export const logoutUser = async () => {
  await removeCookie("accessToken");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
