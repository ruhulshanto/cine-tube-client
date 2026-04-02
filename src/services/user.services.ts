import { httpClient } from "@/lib/axios/httpClient";

export type CurrentUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email: string;
  role: "ADMIN" | "USER";
  avatar?: string | null;
  profileImage?: string | null;
  status?: string;
  createdAt?: string;
};

export type MyProfileStats = {
  heartsGiven: number;
  watchlistCount: number;
  avgRating: number | null;
};

export const getCurrentUser = async () => {
  return httpClient.get<CurrentUser>("auth/me");
};

export const getMyProfileStats = async () => {
  return httpClient.get<MyProfileStats>("users/me/stats");
};

export const updateProfileImage = async (formData: FormData) => {
  return httpClient.patchMultipart<CurrentUser>("users/profile-image", formData);
};

