"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { connectSocket } from "../services/websocket";
import { Send, User, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Chat() {
  const [messages, setMessages] = useState<
    { sender_id: number; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [recipientId, setRecipientId] = useState<number | null>(1);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const fetchChatHistory = async () => {
    if (!recipientId) {
      toast({
        title: "Recipient not selected",
        description: "Please select a recipient",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token is missing!");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chats/${1}/${recipientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch chat history",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token is missing!");
      return;
    }

    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    if (!recipientId) {
      toast({
        title: "Recipient not selected",
        description: "Please select a recipient before sending a message",
        variant: "destructive",
      });
      return;
    }

    const message = {
      to: recipientId,
      content: input,
    };

    socketRef.current.send(JSON.stringify(message));
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Chat Room
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Recipient ID"
              value={recipientId || ""}
              onChange={(e) => setRecipientId(parseInt(e.target.value))}
              className="flex-grow"
            />
            <Button onClick={fetchChatHistory}>
              <RefreshCw className="mr-2 h-4 w-4" /> Get History
            </Button>
          </div>

          <Card>
            <ScrollArea className="h-[400px] p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.sender_id === 1 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      msg.sender_id === 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">{"You"}</p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </Card>

          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow"
            />
            <Button onClick={sendMessage}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
