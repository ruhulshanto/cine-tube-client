export interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
