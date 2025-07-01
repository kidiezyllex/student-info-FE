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
    // Add welcome message when component mounts
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
      console.error("AI chat error:", error);
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
    <div className="space-y-6 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1 h-[calc(100vh-120px)]">
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

      <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
        {/* Chat Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <IconRobot className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-mainTextV1">AI Assistant</CardTitle>
                <p className="text-sm text-secondaryTextV1">
                  Online • Ready to help with your questions
                </p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100">
                  Active
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden">
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
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconRobot className="w-4 h-4 text-purple-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] ${message.isUser ? 'order-first' : ''}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.isUser
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
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconUser className="w-4 h-4 text-blue-600" />
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
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconRobot className="w-4 h-4 text-purple-600" />
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
        <Card className="mt-4">
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
            <p className="text-xs text-secondaryTextV1 mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 