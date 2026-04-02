import { jwtDecode } from "jwt-decode";
import { getCookie } from "./cookieUtils";

export interface DecodedToken {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  exp: number;
}

export const getToken = async (): Promise<string | undefined> => {
  if (typeof window !== 'undefined') {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  }
  return await getCookie('accessToken');
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const getUserInfo = async (): Promise<DecodedToken | null> => {
  const token = await getToken();
  if (!token) return null;
  return decodeToken(token);
};
