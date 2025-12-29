"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyCodeFromEmail, useResetPassword } from "@/hooks/useEmail";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: verifyCode, isPending: isVerifyingCode } =
    useVerifyCodeFromEmail();
  const { mutateAsync: resetPassword, isPending: isResetting } =
    useResetPassword();
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordResetData, setPasswordResetData] = useState({
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    resetCode?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      router.push("/auth/forgot-password");
    }
  }, [searchParams, router]);

  const handlePasswordResetInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validatePasswordReset = () => {
    const newErrors: typeof errors = {};
    if (!passwordResetData.resetCode) {
      newErrors.resetCode = "Reset code is required";
    } else if (passwordResetData.resetCode.length !== 6) {
      newErrors.resetCode = "Reset code must be 6 digits";
    }
    if (!passwordResetData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordResetData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordResetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (
      passwordResetData.newPassword !== passwordResetData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validatePasswordReset()) {
      return;
    }
    try {
      const verifyResponse = await verifyCode({
        email: email,
        code: passwordResetData.resetCode,
      });
      if (verifyResponse.status !== true) {
        toast.error("Invalid reset code");
        return;
      }

      const resetResponse = await resetPassword({
        email: email,
        code: passwordResetData.resetCode,
        newPassword: passwordResetData.newPassword,
        confirmPassword: passwordResetData.confirmPassword,
      });

      if (resetResponse.status === true) {
        toast.success(
          resetResponse.message ||
            "Password has been reset successfully. Please login with your new password."
        );
        router.push("/auth/login");
      } else {
        toast.error(resetResponse.message || "Failed to reset password");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/vgu-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="h-screen w-screen flex justify-center items-center"
    >
      <div className="w-[450px]  mx-auto bg-white/30 backdrop-blur-lg shadow-lg border-0 overflow-hidden rounded-xl">
        <div className="flex flex-col items-center gap-4 py-4 bg-white/30 backdrop-blur-lg shadow-lg border-0 rounded-none">
          <Image
            height={300}
            width={300}
            draggable={false}
            quality={100}
            src="/images/vgu-logo.webp"
            alt="vgu-logo"
            className="w-auto h-20"
          />
        </div>
        <div className="bg-white/20 w-full backdrop-blur-lg shadow-lg border-0 rounded-none overflow-hidden">
          <div className="bg-transparent shadow-none p-4 rounded-none border-none pb-10">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-600">
                  Enter the reset code and your new password
                </p>
                {email && (
                  <p className="text-sm text-gray-500 mt-1">
                    Code sent to: {email}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="resetCode"
                    className="text-sm font-semibold text-gray-800 mb-2 block"
                  >
                    Reset Code (6 digits)
                  </Label>
                  <Input
                    id="resetCode"
                    name="resetCode"
                    type="text"
                    value={passwordResetData.resetCode}
                    onChange={handlePasswordResetInputChange}
                    className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter reset code"
                    disabled={isVerifyingCode || isResetting}
                    maxLength={6}
                  />
                  {errors.resetCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.resetCode}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-semibold text-gray-800 mb-2 block"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordResetData.newPassword}
                      onChange={handlePasswordResetInputChange}
                      className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
                      placeholder="Enter new password"
                      disabled={isVerifyingCode}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                      disabled={isVerifyingCode}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-800 mb-2 block"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordResetData.confirmPassword}
                      onChange={handlePasswordResetInputChange}
                      className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
                      placeholder="Confirm new password"
                      disabled={isVerifyingCode}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                      disabled={isVerifyingCode}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 !bg-white"
                    onClick={() => {
                      router.push("/auth/forgot-password");
                    }}
                    disabled={isVerifyingCode}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={
                      isVerifyingCode ||
                      isResetting ||
                      !passwordResetData.resetCode ||
                      !passwordResetData.newPassword ||
                      !passwordResetData.confirmPassword
                    }
                    className="flex-1 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isVerifyingCode || isResetting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isResetting ? "Resetting..." : "Verifying..."}
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
