"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useUser } from "@/context/useUserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingProfile, profile } = useUser();
  const router = useRouter();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tự động xử lý trường hợp có token nhưng không có profile -> tránh loading vô hạn
  useEffect(() => {
    if (!isClient) return;

    // Chỉ xử lý khi đã load xong profile nhưng vẫn không có profile
    if (!isLoadingProfile && !profile) {
      if (typeof window !== "undefined") {
        const hasAccessTokenLS =
          !!localStorage.getItem("accessToken") ||
          !!localStorage.getItem("token");
        const hasAccessTokenCookie =
          typeof document !== "undefined" &&
          document.cookie
            .split(";")
            .some((c) => c.trim().startsWith("accessToken="));

        // Nếu vẫn còn token/cookie mà không có profile -> clear hết và đưa về trang login
        if (hasAccessTokenLS || hasAccessTokenCookie) {
          try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
            localStorage.removeItem("userProfile");
          } catch (e) {
            console.error("Failed to clear auth storage", e);
          }

          if (typeof document !== "undefined") {
            document.cookie =
              "accessToken=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }

          router.push("/auth/login");
        }
      }
    }
  }, [isClient, isLoadingProfile, profile, router]);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = () => {
      const hasToken =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const hasProfile = localStorage.getItem("userProfile");

      if (!hasToken && !hasProfile && !isLoadingProfile) {
        router.push("/auth/login");
      }
    };

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [isClient, isLoadingProfile, router]);

  useEffect(() => {
    if (isClient && isAuthenticated && profile && !isLoadingProfile) {
      checkUserRole();
    }
  }, [isClient, isAuthenticated, profile, isLoadingProfile]);

  const checkUserRole = () => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return;
    }

    setIsCheckingRole(true);

    const userRole = profile?.data?.role || "student";

    if (!allowedRoles.includes(userRole)) {
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "coordinator") {
        router.push("/coordinator");
      } else {
        router.push("/student");
      }
    }

    setIsCheckingRole(false);
  };

  // Optimized loading states - reduced loading time by checking localStorage first
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoadingProfile || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
