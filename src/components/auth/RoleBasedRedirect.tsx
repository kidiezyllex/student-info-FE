"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/useUserContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RoleBasedRedirect() {
  const router = useRouter();
  const { profile, isLoadingProfile } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          const userRole = parsedProfile?.data?.role;
          
          if (userRole === 'student') {
            router.replace('/student');
          } else if (userRole === 'admin' || userRole === 'coordinator') {
            router.replace('/admin');
          }
          return;
        } catch (error) {
          console.error('Error parsing stored profile:', error);
        }
      }
    }
    
    // Fallback to context profile
    if (!isLoadingProfile && profile?.data) {
      const userRole = profile.data.role;
      
      if (userRole === 'student') {
        router.replace('/student');
      } else {
        router.replace('/admin');
      }
    }
  }, [profile, isLoadingProfile, router]);

  if (isLoadingProfile || !profile) {
    return (
      <div className="min-h-screen bg-mainDarkBackgroundV1 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
} 