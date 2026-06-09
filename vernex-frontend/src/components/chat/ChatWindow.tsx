import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  sender: "ai" | "customer" | "staff";
  body: string;
  time: string;
};

export function ChatWindow({ messages }: { messages: ChatMessage[] }) {
  return (
    <section className="dashboard-surface flex min-h-[520px] flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-semibold">Conversation</h3>
        <p className="text-sm text-muted-foreground">AI assisted customer chat</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.sender === "customer" ? "justify-start" : "justify-end")}
          >
            <div
              className={cn(
                "max-w-[78%] rounded-lg px-4 py-2 text-sm shadow-sm",
                message.sender === "customer" ? "bg-white" : "bg-primary text-primary-foreground"
              )}
            >
              <p>{message.body}</p>
              <span className="mt-1 block text-[11px] opacity-75">{message.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <Input placeholder="Write a message" />
        <Button className="h-10 w-10 px-0" aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
