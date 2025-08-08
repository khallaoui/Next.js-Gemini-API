"use client";

import React, { useState, useRef, useEffect } from "react";
import { chatAboutPensions } from "@/ai/flows/chat-about-pensions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestedQuestions?: string[];
}

interface ChatWindowProps {
  pensionData: string;
  className?: string;
}

export default function ChatWindow({ pensionData, className }: ChatWindowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Bonjour ! Je suis votre assistant IA pour les données de pension. Je peux vous aider à analyser, comprendre et explorer vos données. Que souhaitez-vous savoir ?",
      timestamp: new Date(),
      suggestedQuestions: [
        "Combien de pensionnaires avons-nous au total ?",
        "Quelles sont les tendances de paiement ?",
        "Y a-t-il des anomalies dans les données ?",
        "Quel est le montant moyen des pensions ?"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend) return;

    const newUserMessage: Message = {
      role: "user",
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await chatAboutPensions({
        pensionData,
        userMessage: messageToSend,
        conversationHistory
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.reply,
        timestamp: new Date(),
        suggestedQuestions: response.suggestedQuestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "❌ Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <Button
        className={cn(
          "fixed bottom-6 right-6 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50",
          "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          className
        )}
        onClick={() => setIsOpen(true)}
        size="lg"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Ouvrir le chat IA</span>
      </Button>
    );
  }

  return (
    <Card 
      className={cn(
        "fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl border-0 z-50 transition-all duration-300",
        isMinimized && "h-16",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Assistant Pension IA
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-[calc(600px-80px)] p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      message.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        message.role === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-purple-100 text-purple-600"
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      )}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-1 last:mb-0">{line}</p>
                        ))}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Suggested Questions */}
                  {message.role === "assistant" && message.suggestedQuestions && (
                    <div className="ml-11 space-y-2">
                      <p className="text-xs text-muted-foreground">Questions suggérées :</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestedQuestions.map((question, qIndex) => (
                          <Badge
                            key={qIndex}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                            onClick={() => handleSuggestedQuestion(question)}
                          >
                            {question}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">L'IA réfléchit...</span>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t p-4 space-y-2">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur les données de pension..."
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="px-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Alimenté par Gemini AI • Appuyez sur Entrée pour envoyer</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}