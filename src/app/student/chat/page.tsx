"use client";

import { useState, useRef, useEffect } from "react";
import { useAskAI, useGetChatHistory } from "@/hooks/useChat";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { IconSend, IconRobot, IconUser, IconMessageCircle } from "@tabler/icons-react";
import { useUser } from "@/context/useUserContext";
import { toast } from "react-toastify";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function StudentChatPage() {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: askAI, isPending: isAsking } = useAskAI();
  const { data: chatHistory, isLoading: isLoadingHistory } = useGetChatHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: `Hello ${profile?.data?.name || 'Student'}! I'm your AI assistant. I'm here to help you with information about scholarships, events, academic questions, and more. How can I assist you today?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [profile, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAsking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await askAI({
        question: inputMessage.trim(),
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.data.answer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed mr-4 space-y-6 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1 h-[calc(100vh-100px)]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>AI Chat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col h-full max-h-[calc(100vh-180px)]">
        {/* Chat Header */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-b-none border-b-0">
          <CardHeader className="p-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <IconRobot className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-mainTextV1 mb-1">AI Assistant</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-secondaryTextV1 font-medium">
                    Ready to help with your questions
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden rounded-none border-t-0">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isUser && (
                        <div className="w-10 h-10 overflow-hidden bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Image src="/images/ai-avatar.webp" alt="AI Avatar" width={50} height={50} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className={`max-w-[70%] ${message.isUser ? 'order-first' : ''}`}>
                        <div
                          className={`p-3 rounded-lg ${message.isUser
                              ? 'bg-mainTextHoverV1 text-white'
                              : 'bg-gray-100 text-mainTextV1'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-secondaryTextV1 mt-1 px-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.isUser && (
                        <div className="w-10 h-10 overflow-hidden bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Image src="/images/student.webp" alt="AI Avatar" width={50} height={50} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {(isTyping || isAsking) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 overflow-hidden bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image src="/images/ai-avatar.webp" alt="AI Avatar" width={50} height={50} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="rounded-t-none border-t-0 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 border-lightBorderV1 focus:border-mainTextHoverV1"
                disabled={isAsking}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isAsking}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white px-4"
              >
                <IconSend className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 