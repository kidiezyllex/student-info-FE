"use client";

import { useUser } from "@/context/useUserContext";
import StudentHome from "@/components/StudentHome";

export default function StudentDashboard() {
  const { isAuthenticated, isLoadingProfile } = useUser();
  
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-800">Please sign in to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  return <StudentHome />;
} 