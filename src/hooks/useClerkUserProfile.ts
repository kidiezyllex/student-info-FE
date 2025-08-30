"use client";

import { useCallback, useMemo } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';

export interface ClerkUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  isSignedIn: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useClerkUserProfile = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();

  // 获取用户基本信息
  const profile = useMemo((): ClerkUserProfile | null => {
    if (!clerkUser) return null;
    
    return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      role: localStorage.getItem('userRole') || 'student',
      avatar: clerkUser.imageUrl,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      isSignedIn,
      createdAt: clerkUser.createdAt,
      updatedAt: clerkUser.updatedAt
    };
  }, [clerkUser, isSignedIn]);

  // 检查用户是否有特定角色
  const hasRole = useCallback((role: string): boolean => {
    const userRole = localStorage.getItem('userRole');
    return userRole === role;
  }, []);

  // 检查用户是否是管理员
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  // 检查用户是否是协调员
  const isCoordinator = useCallback((): boolean => {
    return hasRole('coordinator');
  }, [hasRole]);

  // 检查用户是否是学生
  const isStudent = useCallback((): boolean => {
    return hasRole('student');
  }, [hasRole]);

  // 获取用户角色
  const getUserRole = useCallback((): string => {
    return localStorage.getItem('userRole') || 'student';
  }, []);

  // 设置用户角色
  const setUserRole = useCallback((role: string): void => {
    localStorage.setItem('userRole', role);
  }, []);

  return {
    // 状态
    isLoaded,
    isSignedIn,
    user: clerkUser,
    
    // 数据
    profile,
    
    // 角色管理
    hasRole,
    isAdmin,
    isCoordinator,
    isStudent,
    getUserRole,
    setUserRole,
    
    // 原始Clerk用户数据
    clerkUser
  };
};
