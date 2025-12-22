"use client";

import { useState, useEffect, useRef } from "react";
import { useGetTopics, useGetTopicById, useSaveTopic, useUnsaveTopic } from "@/hooks/useTopic";
import { useUser } from "@/context/useUserContext";
import { useGetUserProfile, useUpdateUser } from "@/hooks/useUser";
import { useAskAI, useGetChatHistory, useGetChatSession, useRateAIResponse, useDeleteChatSession } from "@/hooks/useChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { IconRobot, IconSend, IconThumbUp, IconThumbDown, IconEdit, IconCheck, IconX, IconBookmark, IconBookmarkFilled, IconCalendar, IconBell, IconGift, IconTrendingUp } from "@tabler/icons-react";
import { TopicType, ITopic } from "@/interface/response/topic";
import { toast } from "react-toastify";
import Image from "next/image";
import { IUpdateUserBody } from "@/interface/request/user";
import { Skeleton } from "@/components/ui/skeleton";

const topicTypes: TopicType[] = [
  "event",
  "scholarship",
  "notification",
  "job",
  "advertisement",
  "internship",
  "recruitment",
  "volunteer",
  "extracurricular",
];

const typeColorMap: Record<TopicType, string> = {
  event: "#3B82F6",
  scholarship: "#10B981",
  notification: "#F59E0B",
  job: "#6366F1",
  advertisement: "#A855F7",
  internship: "#06B6D4",
  recruitment: "#14B8A6",
  volunteer: "#34D399",
  extracurricular: "#EC4899",
};

const typeLabels: Record<TopicType, string> = {
  event: "Event",
  scholarship: "Scholarship",
  notification: "Notification",
  job: "Job",
  advertisement: "Advertisement",
  internship: "Internship",
  recruitment: "Recruitment",
  volunteer: "Volunteer",
  extracurricular: "Extracurricular",
};

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sessionId?: string;
  messageIndex?: number;
  isAccurate?: boolean;
}

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

  // Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: askAI, isPending: isAsking } = useAskAI();
  const { data: chatHistory } = useGetChatHistory();
  const { data: currentChatSession } = useGetChatSession(currentChatSessionId || "");
  const { mutateAsync: rateResponse } = useRateAIResponse();

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

  useEffect(() => {
    if (currentChatSession?.data?.messages) {
      const sessionMessages: ChatMessage[] = currentChatSession.data.messages.map((msg, index) => {
        const role: "user" | "assistant" = msg.role === "user" ? "user" : "assistant";
        return {
          id: `session-${index}-${Date.now()}`,
          content: msg.content,
          role,
          timestamp: new Date(),
          sessionId: currentChatSession.data._id,
          messageIndex: index,
          isAccurate: msg.isAccurate,
        };
      });
      setChatMessages(sessionMessages);
    }
  }, [currentChatSession]);

  useEffect(() => {
    if (chatMessages.length === 0 && !currentChatSessionId && isChatOpen) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: `Hello ${profile?.data?.name || 'Student'}! I'm your AI assistant. How can I help you today?`,
        role: "assistant",
        timestamp: new Date(),
      };
      setChatMessages([welcomeMessage]);
    }
  }, [profile, chatMessages.length, currentChatSessionId, isChatOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isAsking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: chatInput.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await askAI({
        question: chatInput.trim(),
        sessionId: currentChatSessionId || undefined,
      });

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: response.data.answer,
        role: "assistant",
        timestamp: new Date(),
        sessionId: response.data.sessionId,
      };

      setChatMessages(prev => [...prev, aiMessage]);
      
      if (!currentChatSessionId) {
        setCurrentChatSessionId(response.data.sessionId);
      }
    } catch (error: any) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

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

  const formatMessageContent = (content: string) => {
    const parts = content.split(/(\*{2}[^\*]+\*{2})/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={index} className="font-semibold">{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  const topics = topicsData?.data || [];
  const profileData = (userProfile?.data || {}) as any;

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1 min-h-screen pb-24">
      {/* Profile Section */}
      <Card className="border border-lightBorderV1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">My Profile</CardTitle>
            {!isEditingProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2"
              >
                <IconEdit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingProfile ? (
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
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isUpdatingProfile}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                  className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
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

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-lightBorderV1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Topics</p>
                <p className="text-2xl font-semibold text-gray-800">{topics.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <IconTrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-lightBorderV1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {topics.filter(t => t.type === "event" && t.startDate && new Date(t.startDate) > new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <IconCalendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-lightBorderV1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scholarships</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {topics.filter(t => t.type === "scholarship").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <IconGift className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-lightBorderV1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notifications</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {topics.filter(t => t.type === "notification").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <IconBell className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Filter */}
      <Card className="border border-lightBorderV1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Browse Topics</CardTitle>
          <CardDescription>Filter topics by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              className={selectedType === "all" ? "bg-mainTextHoverV1 hover:bg-primary/90 text-white" : ""}
            >
              All Types
            </Button>
            {topicTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className={selectedType === type ? "bg-mainTextHoverV1 hover:bg-primary/90 text-white" : ""}
              >
                {typeLabels[type]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {selectedType === "all" ? "All Topics" : typeLabels[selectedType as TopicType]}
        </h2>
        {isLoadingTopics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border border-lightBorderV1">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <Card className="border border-lightBorderV1">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No topics found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <motion.div
                key={topic._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="border border-lightBorderV1 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => setSelectedTopicId(topic._id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {topic.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            style={{
                              backgroundColor: typeColorMap[topic.type] + "20",
                              color: typeColorMap[topic.type],
                              borderColor: typeColorMap[topic.type] + "40",
                            }}
                            className="capitalize"
                          >
                            {topic.type}
                          </Badge>
                          {topic.department && (
                            <Badge variant="orange">{topic.department.code}</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveTopic(topic._id, topic.metadata?.isSaved || false);
                        }}
                        className="ml-2"
                      >
                        {topic.metadata?.isSaved ? (
                          <IconBookmarkFilled className="h-5 w-5 text-orange-500" />
                        ) : (
                          <IconBookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{topic.description}</p>
                    {topic.startDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <IconCalendar className="h-4 w-4" />
                        <span>{new Date(topic.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Topic Details Dialog */}
      <Dialog open={!!selectedTopicId} onOpenChange={() => setSelectedTopicId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTopicData?.data ? (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">
                      {selectedTopicData.data.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        style={{
                          backgroundColor: typeColorMap[selectedTopicData.data.type] + "20",
                          color: typeColorMap[selectedTopicData.data.type],
                          borderColor: typeColorMap[selectedTopicData.data.type] + "40",
                        }}
                        className="capitalize"
                      >
                        {selectedTopicData.data.type}
                      </Badge>
                      {selectedTopicData.data.department && (
                        <Badge variant="orange">{selectedTopicData.data.department.name}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveTopic(selectedTopicData.data._id, selectedTopicData.data.metadata?.isSaved || false)}
                  >
                    {selectedTopicData.data.metadata?.isSaved ? (
                      <IconBookmarkFilled className="h-5 w-5 text-orange-500" />
                    ) : (
                      <IconBookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedTopicData.data.description}</p>
                </div>
                {selectedTopicData.data.startDate && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Start Date</h4>
                    <p className="text-gray-600">{new Date(selectedTopicData.data.startDate).toLocaleString()}</p>
                  </div>
                )}
                {selectedTopicData.data.endDate && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">End Date</h4>
                    <p className="text-gray-600">{new Date(selectedTopicData.data.endDate).toLocaleString()}</p>
                  </div>
                )}
                {selectedTopicData.data.location && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                    <p className="text-gray-600">{selectedTopicData.data.location}</p>
                  </div>
                )}
                {selectedTopicData.data.organizer && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Organizer</h4>
                    <p className="text-gray-600">{selectedTopicData.data.organizer}</p>
                  </div>
                )}
                {selectedTopicData.data.applicationDeadline && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Application Deadline</h4>
                    <p className="text-gray-600">{new Date(selectedTopicData.data.applicationDeadline).toLocaleString()}</p>
                  </div>
                )}
                {selectedTopicData.data.company && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Company</h4>
                    <p className="text-gray-600">{selectedTopicData.data.company}</p>
                  </div>
                )}
                {selectedTopicData.data.position && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Position</h4>
                    <p className="text-gray-600">{selectedTopicData.data.position}</p>
                  </div>
                )}
                {selectedTopicData.data.salary && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Salary</h4>
                    <p className="text-gray-600">{selectedTopicData.data.salary}</p>
                  </div>
                )}
                {selectedTopicData.data.contactInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                    <p className="text-gray-600">{selectedTopicData.data.contactInfo}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chatbot Sheet - Sidebar from right */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                <IconRobot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <SheetTitle>AI Assistant</SheetTitle>
                <SheetDescription>Ask me anything about scholarships, events, and more</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <IconRobot className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${message.role === "user" ? "order-first" : ""}`}>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-mainTextHoverV1 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{formatMessageContent(message.content)}</p>
                      </div>
                      {message.role === "assistant" && message.sessionId && message.messageIndex !== undefined && (
                        <div className="flex gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rateResponse({
                              sessionId: message.sessionId!,
                              messageIndex: message.messageIndex!,
                              isAccurate: true,
                            })}
                            className="h-6 w-6 p-0"
                          >
                            <IconThumbUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rateResponse({
                              sessionId: message.sessionId!,
                              messageIndex: message.messageIndex!,
                              isAccurate: false,
                            })}
                            className="h-6 w-6 p-0"
                          >
                            <IconThumbDown className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={`/images/${userProfile?.data?.gender || "male"}-student.webp`}
                          alt="User"
                          width={32}
                          height={32}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <IconRobot className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2 p-4 border-t">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isAsking}
              />
              <Button
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim() || isAsking}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                <IconSend className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Chatbot Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg"
          size="icon"
        >
          <IconRobot className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}

