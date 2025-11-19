import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useSmartGuideChat } from "@/hooks/useSmartGuideChat";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useSmartGuideChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Smart Guide</h1>
              <p className="text-sm text-muted-foreground">Your friendly homework helper</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </Button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-foreground">Welcome to Smart Guide!</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                I'm here to help you understand your homework, explain concepts clearly, 
                and create study guides. Ask me anything!
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                <div className="p-4 rounded-lg bg-accent border border-border">
                  <h3 className="font-semibold mb-2 text-accent-foreground">📚 Explain Concepts</h3>
                  <p className="text-sm text-muted-foreground">Get clear explanations of any topic in simple language</p>
                </div>
                <div className="p-4 rounded-lg bg-accent border border-border">
                  <h3 className="font-semibold mb-2 text-accent-foreground">📝 Study Guides</h3>
                  <p className="text-sm text-muted-foreground">Create organized study guides with key points and examples</p>
                </div>
                <div className="p-4 rounded-lg bg-accent border border-border">
                  <h3 className="font-semibold mb-2 text-accent-foreground">🎯 Step-by-Step Help</h3>
                  <p className="text-sm text-muted-foreground">Break down complex problems into easy steps</p>
                </div>
                <div className="p-4 rounded-lg bg-accent border border-border">
                  <h3 className="font-semibold mb-2 text-accent-foreground">💡 Practice Questions</h3>
                  <p className="text-sm text-muted-foreground">Get practice problems to test your understanding</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 p-4 rounded-lg bg-card mr-8">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-2">Smart Guide</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="pt-4 border-t bg-background">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
