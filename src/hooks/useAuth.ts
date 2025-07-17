"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetUserProfile } from "./useUser";
import { isAuthenticated } from "@/utils/auth";
import { useUser } from "@/context/useUserContext";
import cookies from "js-cookie";
import { useMutation } from '@tanstack/react-query';
import { login, register } from '@/api/auth';
import { ILoginBody, IRegisterBody } from '@/interface/request/auth';
import { ILoginResponse, IRegisterResponse } from '@/interface/response/auth';

/**
 * @returns {{
 *   isLoading: boolean,
 *   isAuth: boolean,
 *   checkAndRedirect: () => void,
 *   profileData: any
 * }}
 */
export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated: userContextAuth } = useUser();
  const hasAccessToken = cookies.get("accessToken");
  const isPublicRoute = pathname === "/login" || pathname === "/register";
  const { data: profileData, error: profileError, isError } = useGetUserProfile({ enabled: !!hasAccessToken && !isPublicRoute });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (!hasAccessToken) {
      setIsAuth(false);
      setIsLoading(false);
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }

    if (isError || profileError) {
      cookies.remove("accessToken");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
      }
      setIsAuth(false);
      setIsLoading(false);
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }
    
    if (hasAccessToken && profileData) {
      setIsAuth(true);
      setIsLoading(false);
    } else if (hasAccessToken && !profileData) {
      // Still loading profile data
      setIsLoading(true);
    }
  }, [profileData, userContextAuth, isError, profileError, hasAccessToken, isPublicRoute, router]);

  const checkAndRedirect = useCallback(() => {
    // This function might not be strictly needed now, as redirection is handled in useEffect
    // but keeping it for potential future use or other scenarios
    if (!isAuth && !isLoading && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isAuth, isLoading, router, isPublicRoute]);

  return {
    isLoading,
    isAuth,
    checkAndRedirect,
    profileData,
    isPublicRoute
  };
};

export const useLogin = () => {
  return useMutation<ILoginResponse, Error, ILoginBody>({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation<IRegisterResponse, Error, IRegisterBody>({
    mutationFn: register,
  });
}; 