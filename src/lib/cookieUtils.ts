/**
 * Highly optimized, production-grade cookie utilities for Cinema-Tube.
 * Handles secure token reading and deletion across client/server boundaries.
 */

export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  
  return undefined;
};

export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return;
  
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure`;
};

export const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
