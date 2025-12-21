"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/auth/login";

  return (
    <div suppressHydrationWarning>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </ProtectedRoute>
      )}
    </div>
  );
}
