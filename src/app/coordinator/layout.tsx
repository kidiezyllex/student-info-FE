"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/coordinator/auth/login";

  return (
    <div suppressHydrationWarning>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute allowedRoles={["coordinator"]}>
          <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
      )}
    </div>
  );
}
