"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinnerWithText } from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuth, checkAndRedirect, profileData, isPublicRoute } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isPublicRoute) return; // Do not apply protection to public routes

    if (!isLoading && !isAuth) {
      checkAndRedirect();
    } else if (!isLoading && isAuth && profileData) {
      if (profileData?.data.role === "admin") {
        router.replace("/admin");
      } else if (profileData?.data.role === "student") {
        router.replace("/student");
      }
    }
  }, [isLoading, isAuth, checkAndRedirect, profileData, router, isPublicRoute]);

  if (isPublicRoute) {
    return <>{children}</>; // Render children directly for public routes
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinnerWithText
          text="Loading..."
          size="lg"
          className="min-h-screen"
        />
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
} 