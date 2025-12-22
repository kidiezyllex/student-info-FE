"use client";

import { useState, useEffect } from "react";
import { useGetTopics, useGetTopicById, useSaveTopic, useUnsaveTopic } from "@/hooks/useTopic";
import { useUser } from "@/context/useUserContext";
import { useGetUserProfile, useUpdateUser } from "@/hooks/useUser";
import { IUpdateUserBody } from "@/interface/request/user";
import { TopicType } from "@/interface/response/topic";
import { toast } from "react-toastify";
import { ProfileSection } from "./ProfileSection";
import { StatsSection } from "./StatsSection";
import { TopicFilters } from "./TopicFilters";
import { TopicCards } from "./TopicCards";
import { TopicDetailsDialog } from "./TopicDetailsDialog";
import { topicTypes, typeColorMap, typeLabels } from "./constants";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

export default function StudentHome() {
  const { profile } = useUser();
  const { data: userProfile, refetch: refetchProfile } = useGetUserProfile();
  const { mutate: updateUserMutation, isPending: isUpdatingProfile } = useUpdateUser();
  
  // Topics
  const [selectedType, setSelectedType] = useState<TopicType | "all">("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const { data: topicsData, isLoading: isLoadingTopics } = useGetTopics({
    type: selectedType === "all" ? undefined : selectedType,
    page: 1,
    limit: 20,
  });
  const { data: selectedTopicData } = useGetTopicById(selectedTopicId || "");
  const { mutate: saveTopicMutation } = useSaveTopic();
  const { mutate: unsaveTopicMutation } = useUnsaveTopic();

  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState<IUpdateUserBody>({
    name: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    avatar: "",
  });

  useEffect(() => {
    if (userProfile?.data) {
      // Một số field chưa có trong kiểu IProfileData, dùng any để tránh lỗi type
      const user = userProfile.data as any;
      setProfileFormData({
        name: user.name || "",
        email: user.email || "",
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
      });
    }
  }, [userProfile]);

  const handleSaveTopic = (topicId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveTopicMutation(topicId, {
        onSuccess: () => toast.success("Topic unsaved"),
      });
    } else {
      saveTopicMutation(topicId, {
        onSuccess: () => toast.success("Topic saved"),
      });
    }
  };

  const handleUpdateProfile = () => {
    if (!userProfile?.data?._id) return;
    
    updateUserMutation(
      { id: userProfile.data._id, data: profileFormData },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
          setIsEditingProfile(false);
          refetchProfile();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update profile");
        },
      }
    );
  };

  const topics = topicsData?.data || [];
  const profileData = (userProfile?.data || {}) as any;

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1 min-h-screen pb-24">
      <ProfileSection
        isEditing={isEditingProfile}
        profileFormData={profileFormData}
        setProfileFormData={setProfileFormData}
        profileData={profileData}
        isUpdating={isUpdatingProfile}
        onEdit={() => setIsEditingProfile(true)}
        onCancel={() => setIsEditingProfile(false)}
        onSave={handleUpdateProfile}
      />

      <StatsSection topics={topics} />

      {/* Topic Filter */}
      <Card className="border border-lightBorderV1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Browse Topics</CardTitle>
          <CardDescription>Filter topics by type</CardDescription>
        </CardHeader>
        <CardContent>
          <TopicFilters
            selectedType={selectedType}
            onSelectType={setSelectedType}
            topicTypes={topicTypes}
            typeLabels={typeLabels}
          />
        </CardContent>
      </Card>

      {/* Topic Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {selectedType === "all" ? "All Topics" : typeLabels[selectedType as TopicType]}
        </h2>
        <TopicCards
          topics={topics}
          isLoading={isLoadingTopics}
          selectedType={selectedType}
          typeLabels={typeLabels}
          typeColorMap={typeColorMap}
          onSelectTopic={setSelectedTopicId}
          onToggleSave={handleSaveTopic}
        />
      </div>

      {/* Topic Details Dialog */}
      <TopicDetailsDialog
        selectedTopicId={selectedTopicId}
        selectedTopicData={selectedTopicData as any}
        onClose={() => setSelectedTopicId(null)}
        onToggleSave={handleSaveTopic}
        typeColorMap={typeColorMap}
      />
    </div>
  );
}

