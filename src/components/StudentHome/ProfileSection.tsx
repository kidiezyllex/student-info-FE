"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUpdateUserBody } from "@/interface/request/user";

type ProfileSectionProps = {
  isEditing: boolean;
  profileFormData: IUpdateUserBody;
  setProfileFormData: (data: IUpdateUserBody) => void;
  profileData: any;
  isUpdating: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export function ProfileSection({
  isEditing,
  profileFormData,
  setProfileFormData,
  profileData,
  isUpdating,
  onEdit,
  onCancel,
  onSave,
}: ProfileSectionProps) {
  return (
    <Card className="border border-lightBorderV1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">My Profile</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileFormData.fullName}
                  onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={profileFormData.phoneNumber}
                  onChange={(e) => setProfileFormData({ ...profileFormData, phoneNumber: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={profileData?.studentId || ""}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={isUpdating}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              <Image
                src={profileData?.avatar || `/images/${profileData?.gender || "male"}-student.webp`}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{profileData?.fullName || profileData?.name}</h3>
              <p className="text-gray-600">{profileData?.email}</p>
              <p className="text-gray-600">{profileData?.phoneNumber}</p>
              {profileData?.studentId && (
                <Badge variant="orange" className="mt-2">{profileData?.studentId}</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

