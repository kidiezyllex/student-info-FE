import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning>
      <ProtectedRoute>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </ProtectedRoute>
    </div>
  );
}
