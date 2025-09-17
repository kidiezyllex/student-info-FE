"use client";

import { useState, useRef, useEffect } from "react";
import { useAskAI, useGetChatHistory, useGetChatSession, useRateAIResponse, useDeleteChatSession } from "@/hooks/useChat";
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
import { IconSend, IconRobot, IconThumbUp, IconThumbDown, IconTrash, IconPlus, IconHistory, IconX, IconMessageCircle } from "@tabler/icons-react";
import { useUser } from "@/context/useUserContext";
import { toast } from "react-toastify";
import Image from "next/image";
import { IChatMessage, IChatHistoryItem } from "@/interface/response/chat";
import { getTokenFromLocalStorage } from "@/utils/tokenStorage";
import cookies from "js-cookie";

interface Message extends IChatMessage {
  id: string;
  timestamp: Date;
  isUser: boolean;
  sessionId?: string;
  messageIndex?: number;
}

const formatMessageContent = (content: string) => {
  const parts = content.split(/(\*{2}[^\*]+\*{2})/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={index} className="font-semibold">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

export default function ChatPage() {
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: askAI, isPending: isAsking } = useAskAI();
  const { data: chatHistory, isLoading: historyLoading } = useGetChatHistory();
  const { data: currentSession } = useGetChatSession(currentSessionId || "");
  const { mutateAsync: rateResponse } = useRateAIResponse();
  const { mutateAsync: deleteSession } = useDeleteChatSession();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentSession?.data?.messages) {
      const sessionMessages: Message[] = currentSession.data.messages.map((msg, index) => ({
        id: `session-${index}-${Date.now()}`,
        content: msg.content,
        role: msg.role,
        isUser: msg.role === "user",
        timestamp: new Date(),
        sessionId: currentSession.data._id,
        messageIndex: index,
        isAccurate: msg.isAccurate,
      }));
      setMessages(sessionMessages);
    }
  }, [currentSession]);

  useEffect(() => {
    if (messages.length === 0 && !currentSessionId) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: `Hello ${profile?.data?.name || 'Student'}! I'm your AI assistant. I'm here to help you with information about scholarships, events, academic questions, and more. How can I assist you today?`,
        role: "assistant",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [profile, messages.length, currentSessionId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAsking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      role: "user",
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await askAI({
        question: inputMessage.trim(),
        sessionId: currentSessionId || undefined,
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.data.answer,
        role: "assistant",
        isUser: false,
        timestamp: new Date(),
        sessionId: response.data.sessionId,
      };

      setMessages(prev => [...prev, aiMessage]);
      if (!currentSessionId) {
        setCurrentSessionId(response.data.sessionId);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        role: "assistant",
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

  const handleRateMessage = async (messageIndex: number, isAccurate: boolean) => {
    if (!currentSessionId) return;

    try {
      await rateResponse({
        sessionId: currentSessionId,
        messageIndex,
        isAccurate,
      });

      setMessages(prev => prev.map((msg, index) => 
        index === messageIndex ? { ...msg, isAccurate } : msg
      ));

      toast.success(`Response ${isAccurate ? 'liked' : 'disliked'} successfully!`);
    } catch (error) {
      toast.error("Failed to rate response. Please try again.");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast.success("Chat session deleted successfully!");
      
      // If current session was deleted, start new chat
      if (sessionId === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      toast.error("Failed to delete session. Please try again.");
    }
  };

  const handleLoadSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowHistory(false);
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setShowHistory(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-100px)] mr-4 space-x-4">
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: -300, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "320px" }}
            exit={{ opacity: 0, x: -300, width: 0 }}
            className="overflow-hidden"
          >
            <Card className="h-full bg-mainBackgroundV1 border border-lightBorderV1">
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-lg font-semibold">Chat History</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="h-8 w-8 flex items-center justify-center p-0"
                  >
                    <IconX className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4">
                  <Button
                    onClick={handleNewChat}
                    className="w-full mb-4 bg-mainTextHoverV1 hover:bg-primary/90"
                  >
                    <IconMessageCircle className="w-4 h-4" />
                    New Chat
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-280px)] max-w-[320px] w-[320px]">
                  <div className="px-4 space-y-2 max-w-[320px] w-[320px]">
                    {historyLoading ? (
                      <div className="text-sm text-secondaryTextV1">Loading history...</div>
                    ) : (
                      chatHistory?.data?.map((session: IChatHistoryItem) => (
                        <div
                          key={session._id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentSessionId === session._id
                              ? "bg-orange-50 border-orange-200"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div
                            onClick={() => handleLoadSession(session._id)}
                            className="flex-1"
                          >
                            <h4 className="font-semibold text-base text-mainTextV1 truncate">
                              {session.title}
                            </h4>
                            <p className="text-xs text-secondaryTextV1 mt-1">
                              {formatSessionDate(session.lastActive)}
                            </p>
                          </div>
                          <div className="flex items-center justify-end mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session._id);
                              }}
                            >
                              <IconTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Interface */}
      <div className="flex-1 space-y-4 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
        <div className="flex items-center justify-between">
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
        </div>

        <div className="flex flex-col h-full max-h-[calc(100vh-180px)]">
          {/* Chat Header */}
          <Card className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-b-none border-b-0">
            <CardHeader className="p-3 w-full flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <IconRobot className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-mainTextV1 mb-1">AI Assistant</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-secondaryTextV1 font-semibold">
                      {currentSessionId ? "Continuing conversation" : "Ready to help with your questions"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              <IconHistory className="w-4 h-4" />
              History
            </Button>
            <Button
              variant="outline"
              onClick={handleNewChat}
              className="flex items-center gap-2"
            >
              <IconPlus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
            </CardHeader>
          </Card>

          {/* Chat Messages */}
          <Card className="flex-1 overflow-hidden rounded-none border-t-0 min-h-0">
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
                        className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!message.isUser && (
                          <div className="w-12 h-12 overflow-hidden bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                            <p className="text-sm whitespace-pre-wrap">{formatMessageContent(message.content)}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1 px-1">
                            <p className="text-xs text-secondaryTextV1">
                              {formatTime(message.timestamp)}
                            </p>
                            
                            {/* Rating buttons for AI messages */}
                            {!message.isUser && message.sessionId && message.messageIndex !== undefined && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRateMessage(message.messageIndex!, true)}
                                  className={`h-8 w-8 p-0 ${
                                    message.isAccurate === true 
                                      ? 'text-green-600 bg-green-50' 
                                      : 'text-gray-400 hover:text-green-600'
                                  }`}
                                >
                                  <IconThumbUp className="w-5 h-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRateMessage(message.messageIndex!, false)}
                                  className={`h-8 w-8 p-0 ${
                                    message.isAccurate === false 
                                      ? 'text-red-600 bg-red-50' 
                                      : 'text-gray-400 hover:text-red-600'
                                  }`}
                                >
                                  <IconThumbDown className="w-5 h-5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {message.isUser && (
                          <div className="w-12 h-12 overflow-hidden bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Image src="/images/student.webp" alt="Student Avatar" width={50} height={50} className="w-full h-full object-cover" />
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
                      className="flex gap-2"
                    >
                      <div className="w-12 h-12 overflow-hidden bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
    </div>
  );
} 