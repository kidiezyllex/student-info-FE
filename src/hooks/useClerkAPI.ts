"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

interface ClerkAPIResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors: any;
  timestamp: string;
}

export const useClerkAPI = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callAPIWithClerkToken = useCallback(async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ClerkAPIResponse<T>> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 首先尝试使用本地存储的token
      const localToken = localStorage.getItem('userToken');
      
      if (localToken) {
        try {
          const response = await callAPIWithLocalToken(endpoint, localToken, options);
          return response;
        } catch (localError: any) {
          // 如果本地token失败，清除它并尝试Clerk token
          if (localError?.status === 401) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
          } else {
            throw localError;
          }
        }
      }

      // 使用Clerk token
      const clerkToken = await getToken();
      
      if (!clerkToken) {
        throw new Error('无法获取 Clerk token');
      }

      const response = await callAPIWithClerkTokenInternal(endpoint, clerkToken, options);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('未知错误');
      setError(error);
      console.error('Clerk API Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const callAPIWithLocalToken = async <T = any>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<ClerkAPIResponse<T>> => {
    const baseURL = 'https://student-info-be.onrender.com/api';
    const fullURL = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;

    const response = await fetch(fullURL, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', response.status, errorText);
      
      // 尝试解析错误响应
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      const error = new Error(`HTTP error! status: ${response.status}`);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    const data: ClerkAPIResponse<T> = await response.json();
    
    if (data.status === false) {
      throw new Error(data.message || 'API 调用失败');
    }

    return data;
  };

  const callAPIWithClerkTokenInternal = async <T = any>(
    endpoint: string,
    clerkToken: string,
    options: RequestInit = {}
  ): Promise<ClerkAPIResponse<T>> => {
    const baseURL = 'https://student-info-be.onrender.com/api';
    const fullURL = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;

    const response = await fetch(fullURL, {
      ...options,
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
        'Content-Type': 'application/json',
        'X-Clerk-Token': 'true', // 标识这是Clerk token
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', response.status, errorText);
      
      // 尝试解析错误响应
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      const error = new Error(`HTTP error! status: ${response.status}`);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    const data: ClerkAPIResponse<T> = await response.json();
    
    if (data.status === false) {
      throw new Error(data.message || 'API 调用失败');
    }

    return data;
  };

  const getProfile = useCallback(async () => {
    return callAPIWithClerkToken('/auth/profile');
  }, [callAPIWithClerkToken]);

  const getUsers = useCallback(async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return callAPIWithClerkToken(`/users${queryString}`);
  }, [callAPIWithClerkToken]);

  const getEvents = useCallback(async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return callAPIWithClerkToken(`/events${queryString}`);
  }, [callAPIWithClerkToken]);

  const getScholarships = useCallback(async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return callAPIWithClerkToken(`/scholarships${queryString}`);
  }, [callAPIWithClerkToken]);

  const getNotifications = useCallback(async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return callAPIWithClerkToken(`/notifications${queryString}`);
  }, [callAPIWithClerkToken]);

  return {
    callAPIWithClerkToken,
    getProfile,
    getUsers,
    getEvents,
    getScholarships,
    getNotifications,
    isLoading,
    error,
  };
};
