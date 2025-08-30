"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetUserProfile } from "./useUser";
import { isAuthenticated } from "@/utils/auth";
import { useUser } from "@/context/useUserContext";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import cookies from "js-cookie";
import { useMutation } from '@tanstack/react-query';
import { login, register, completeRegistration } from '@/api/auth';
import { ILoginBody, IRegisterBody, ICompleteRegistrationBody } from '@/interface/request/auth';
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
  const isPublicRoute = pathname === "/login" || pathname?.startsWith("/login/") || pathname === "/register";
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

export const useCompleteRegistration = () => {
  return useMutation<IRegisterResponse, Error, ICompleteRegistrationBody>({
    mutationFn: completeRegistration,
  });
}; 

export const useClerkRegister = () => {
  const router = useRouter();
  const { getToken } = useClerkAuth();
  const { mutateAsync: registerUser, isPending, error } = useRegister();

  const handleClerkRegister = useCallback(async (
    clerkUser: any,
    additionalData?: { role?: string; name?: string }
  ) => {
    try {
      // 从 Clerk 用户获取基本信息
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      const firstName = clerkUser.firstName;
      const lastName = clerkUser.lastName;
      
      if (!email) {
        throw new Error('邮箱地址不可用');
      }

      // 获取 Clerk 的 JWT token
      const clerkToken = await getToken();
      
      if (!clerkToken) {
        throw new Error('无法获取 Clerk token');
      }

      // 构建注册数据
      const registerData: IRegisterBody = {
        name: additionalData?.name || `${firstName || ''} ${lastName || ''}`.trim() || 'User',
        email: email,
        password: '', // Clerk 已经处理了密码，这里可以为空或生成随机密码
        role: additionalData?.role || 'student'
      };

      // 调用注册 API，使用 Clerk token
      const response = await registerUser(registerData);
      
      if (response?.data?.token) {
        // 设置后端返回的 token 到 cookies 和 localStorage
        cookies.set('accessToken', response.data.token, { expires: 7 }); // 7天过期
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('clerkToken', clerkToken); // 保存 Clerk token
        }

        // 根据角色重定向
        const role = response.data.role;
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'coordinator') {
          router.push('/coordinator');
        } else {
          router.push('/student');
        }

        return { success: true, data: response.data };
      } else {
        throw new Error('注册成功但未获取到 token');
      }
    } catch (err) {
      console.error('Clerk 注册失败:', err);
      return { success: false, error: err };
    }
  }, [registerUser, router]);

  return {
    handleClerkRegister,
    isPending,
    error
  };
}; 

export const useClerkProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { getToken } = useClerkAuth();

  const fetchProfileWithClerkToken = useCallback(async (clerkUser: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 获取 Clerk 的 JWT token
      const clerkToken = await getToken();
      
      if (!clerkToken) {
        throw new Error('无法获取 Clerk token');
      }

      // 使用 Clerk token 调用后端 API
      const response = await fetch('https://student-info-be.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${clerkToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === false) {
        throw new Error(data.message || '获取用户资料失败');
      }

      setProfileData(data.data);
      return data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('未知错误');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchProfileWithClerkToken,
    isLoading,
    error,
    profileData,
  };
}; 