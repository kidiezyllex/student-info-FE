"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinnerWithText } from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuth, checkAndRedirect, profileData } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      checkAndRedirect();
    }
  }, [isLoading, isAuth, checkAndRedirect, profileData]);

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