"use client";

import { useState } from 'react';
import { useClerkRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ClerkRegistrationFlowProps {
  clerkUser: any;
  onSuccess?: (userData: any) => void;
  onError?: (error: any) => void;
}

export const ClerkRegistrationFlow = ({
  clerkUser,
  onSuccess,
  onError
}: ClerkRegistrationFlowProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'student'
  });
  
  const { handleClerkRegister, isPending, error } = useClerkRegister();

  // 从 Clerk 用户获取默认值
  const defaultName = clerkUser?.firstName && clerkUser?.lastName 
    ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
    : clerkUser?.firstName || clerkUser?.lastName || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await handleClerkRegister(clerkUser, {
        name: formData.name || defaultName,
        role: formData.role
      });

      if (result.success) {
        onSuccess?.(result.data);
      } else {
        onError?.(result.error);
      }
    } catch (err) {
      onError?.(err);
    }
  };

  if (isPending) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">正在完成注册...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>完成注册</CardTitle>
        <CardDescription>
          请填写以下信息完成您的账户注册
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              type="text"
              placeholder="请输入您的姓名"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              defaultValue={defaultName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择您的角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">学生</SelectItem>
                <SelectItem value="coordinator">协调员</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error.message || '注册失败，请重试'}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? '注册中...' : '完成注册'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>邮箱:</strong> {clerkUser?.primaryEmailAddress?.emailAddress}
          </p>
          <p className="text-sm text-gray-600">
            <strong>状态:</strong> 
            <span className="text-green-600 ml-1">已验证</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
