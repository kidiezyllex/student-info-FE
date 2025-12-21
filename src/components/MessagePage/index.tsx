"use client";

import { useState, useRef, useEffect } from "react";
import { useGetConversations, useGetConversationHistory, useSendMessage, useMarkAllMessagesAsRead } from "@/hooks/useMessage";
import { useGetAllUsers } from "@/hooks/useUser";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { IconSend, IconMessageCircle, IconSearch, IconCheck, IconUser, IconUsers, IconX } from "@tabler/icons-react";
import { useUser } from "@/context/useUserContext";
import { toast } from "react-toastify";
import Image from "next/image";
import { IConversation, IMessage } from "@/interface/response/message";
import { IUser } from "@/interface/response/user";

export default function MessagePage() {
  const { profile } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useGetConversations();
  const { data: conversationHistory, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetConversationHistory(selectedConversation || "");
  const { data: allUsersData } = useGetAllUsers(1, 1000); // Fetch all users for message selection
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();
  const { mutateAsync: markAllAsRead } = useMarkAllMessagesAsRead();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversation || isSending) return;

    try {
      await sendMessage({
        receiverId: selectedConversation,
        content: inputMessage.trim(),
      });

      setInputMessage("");
      refetchMessages();
      refetchConversations();
    } catch (error: any) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = async (userId: string) => {
    setSelectedConversation(userId);
    try {
      await markAllAsRead(userId);
      refetchConversations();
    } catch (error) {
      toast.error("Failed to mark messages as read");
    }
  };

  const handleStartNewConversation = (userId: string) => {
    setSelectedConversation(userId);
    setShowNewMessageModal(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return messageDate.toLocaleDateString();
  };

  const formatMessageContent = (content: string) => {
    return content.replace(/\*\*(VGU Research Day)\*\*/g, '<strong>$1</strong>');
  };

  // Filter conversations based on search
  const filteredConversations = conversationsData?.data?.filter((conversation: IConversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Filter users for new conversation (exclude existing conversations)
  const existingConversationUserIds = conversationsData?.data?.map((conv: IConversation) => conv.userId) || [];
  const availableUsers = allUsersData?.data?.filter((user: IUser) => 
    !existingConversationUserIds.includes(user._id) && 
    user._id !== profile?.data?._id &&
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const selectedUser = conversationsData?.data?.find((conv: IConversation) => conv.userId === selectedConversation);

  return (
    <div className="flex h-[calc(100vh-100px)] mr-4 space-x-4">
      {/* Conversations Sidebar */}
      <Card className="w-80 bg-mainBackgroundV1 border border-lightBorderV1 flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Messages</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewMessageModal(!showNewMessageModal)}
              className="h-8 w-8 flex items-center justify-center p-0"
            >
              <IconMessageCircle className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2 border-lightBorderV1 focus:border-mainTextHoverV1"
            />
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-4 h-4" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 hover:text-red-500 transition-colors"
                type="button"
              >
                <IconX className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            {/* New Message Section */}
            {showNewMessageModal && (
              <div className="p-4 border-b bg-orange-50">
                <h3 className="font-semibold text-sm mb-2">Start new conversation</h3>
                <div className="space-y-2">
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-secondaryTextV1">No available users found</p>
                  ) : (
                    availableUsers.map((user: IUser) => (
                      <div
                        key={user._id}
                        onClick={() => handleStartNewConversation(user._id)}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <div className="w-8 h-8 overflow-hidden bg-orange-100 rounded-full flex items-center justify-center">
                          <IconUser className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-mainTextV1">{user.name}</p>
                          <p className="text-xs text-secondaryTextV1">{user.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Existing Conversations */}
            <div className="p-2 space-y-1">
              {isLoadingConversations ? (
                <div className="text-sm text-secondaryTextV1 p-4">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-sm text-secondaryTextV1 p-4">No conversations found</div>
              ) : (
                filteredConversations.map((conversation: IConversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => handleSelectConversation(conversation.userId)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.userId
                        ? "bg-orange-50 border-orange-200 border"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-orange-100 rounded-full flex items-center justify-center">
                        <IconUser className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-mainTextV1 truncate">
                            {conversation.name}
                          </h4>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-secondaryTextV1 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-secondaryTextV1 mt-1">
                          {formatDate(conversation.lastMessageDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Chat Interface */}
      <div className="flex-1 space-y-4 bg-mainBackgroundV1 p-4 rounded-lg border border-lightBorderV1">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Message Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {selectedConversation ? (
          <div className="flex flex-col h-full max-h-[calc(100vh-180px)]">
            {/* Chat Header */}
            <Card className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-b-none border-b-0">
              <CardHeader className="p-3 w-full flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <IconUser className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-mainTextV1">
                      {selectedUser?.name}
                    </CardTitle>
                    <p className="text-sm text-secondaryTextV1">
                      {selectedUser?.unreadCount && selectedUser.unreadCount > 0 ? `${selectedUser.unreadCount} unread messages` : "No unread messages"}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Chat Messages */}
            <Card className="flex-1 overflow-hidden rounded-none border-t-0">
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {isLoadingMessages ? (
                      <div className="text-center py-8 text-secondaryTextV1">Loading messages...</div>
                    ) : (
                      <AnimatePresence>
                        {conversationHistory?.data?.map((message: IMessage, index: number) => (
                          <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex gap-2 ${
                              message.senderId === profile?.data?._id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.senderId !== profile?.data?._id && (
                              <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <IconUser className="w-5 h-5 text-orange-600" />
                              </div>
                            )}

                            <div className={`max-w-[70%] ${message.senderId === profile?.data?._id ? 'order-first' : ''}`}>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.senderId === profile?.data?._id
                                    ? 'bg-mainTextHoverV1 text-white'
                                    : 'bg-gray-100 text-mainTextV1'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}></p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1 px-1">
                                <p className="text-xs text-secondaryTextV1">
                                  {formatTime(message.createdAt)}
                                </p>
                                {message.senderId === profile?.data?._id && (
                                  <div className="flex items-center gap-1">
                                    <IconCheck className={`w-3 h-3 ${message.read ? 'text-orange-500' : 'text-gray-400'}`} />
                                    {message.read && <IconCheck className="w-3 h-3 text-orange-500 -ml-1" />}
                                  </div>
                                )}
                              </div>
                            </div>

                            {message.senderId === profile?.data?._id && (
                              <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Image src="/images/admin.webp" alt="Admin Avatar" width={50} height={50} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Message Input */}
            <Card className="rounded-t-none border-t-0 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 border-lightBorderV1 focus:border-mainTextHoverV1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isSending}
                    className="bg-mainTextHoverV1 hover:bg-primary/90 text-white px-4"
                  >
                    <IconSend className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <IconUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-mainTextV1 mb-2">Select a conversation</h3>
              <p className="text-secondaryTextV1 text-sm">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 