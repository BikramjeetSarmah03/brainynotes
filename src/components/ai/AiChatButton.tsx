"use client";

import { useState } from "react";
import { Bot } from "lucide-react";

import AiChatBox from "./AiChatBox";

import { Button } from "@/components/ui/button";

export default function AiChatButton() {
  const [chatboxOpen, setChatboxOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatboxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>

      <AiChatBox open={chatboxOpen} onClose={() => setChatboxOpen(false)} />
    </>
  );
}
