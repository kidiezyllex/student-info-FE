"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useClerkRegister } from '@/hooks/useAuth';
import { useClerkAPI } from '@/hooks/useClerkAPI';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ClerkVerificationHandlerProps {
  onVerificationComplete?: (userData: any) => void;
  onError?: (error: any) => void;
  role?: string;
  customName?: string;
}

export const ClerkVerificationHandler = ({
  onVerificationComplete,
  onError,
  role = 'student',
  customName
}: ClerkVerificationHandlerProps) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { handleClerkRegister, isPending, error } = useClerkRegister();
  const { getProfile, isLoading: isProfileLoading } = useClerkAPI();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // 检查邮箱是否已验证
      const isEmailVerified = user.primaryEmailAddress?.verification?.status === 'verified';
      
      if (isEmailVerified) {
        // 邮箱验证完成，开始注册流程
        handleClerkRegister(user, { role, name: customName })
          .then(async (result) => {
            if (result.success) {
              try {
                // 注册成功后，使用 Clerk token 获取用户资料
                const profileResponse = await getProfile(user);
                onVerificationComplete?.({ 
                  ...result.data, 
                  profile: profileResponse.data 
                });
              } catch (profileError) {
                console.error('获取用户资料失败:', profileError);
                // 即使获取资料失败，注册仍然成功
                onVerificationComplete?.(result.data);
              }
            } else {
              onError?.(result.error);
            }
          })
          .catch((err) => {
            onError?.(err);
          });
      }
    }
  }, [isLoaded, isSignedIn, user, handleClerkRegister, getProfile, role, customName, onVerificationComplete, onError]);

  if (isPending || isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">
          {isPending ? '正在完成注册...' : '正在获取用户资料...'}
        </p>
      </div>
    );
  }

  return null;
};
