"use client";
import { useChat } from "ai/react";

import { cn } from "@/lib/utils";

import { Bot, Loader2, TrashIcon, X, XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface AiChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AiChatBox({ open, onClose }: AiChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] bg-background shadow xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <div className="flex w-full items-center justify-between p-4">
        <h1 className="font-serif text-xl underline">Ai Chat</h1>

        <button onClick={onClose} className=" mb-1 block">
          <XCircle size={30} />
        </button>
      </div>

      <div className="flex h-[600px] flex-col rounded bg-gray-50 dark:bg-gray-900">
        <div className="h-full overflow-y-auto p-4" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}

          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}

          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}

          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              Ask the AI a question about your notes
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="m-4 flex gap-2">
          <Button
            title="Clear Chat"
            size={"icon"}
            variant={"destructive"}
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
            disabled={isLoading}
          >
            <TrashIcon />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            ref={inputRef}
            disabled={isLoading}
          />
          <Button type="submit" size={"sm"} disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-2 flex",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 mt-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-4 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>

      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="user-image"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
