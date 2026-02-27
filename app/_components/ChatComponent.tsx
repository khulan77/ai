// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect, useRef } from "react";
// import { MessageCircle, X, Send } from "lucide-react";
// import OpenAI from "openai";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY!,
// //   dangerouslyAllowBrowser: true,
// // });

// export const ChatComponent = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<
//     { role: "user" | "assistant"; content: string }[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const toggleChat = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     const current = chatContainerRef.current as any;
//     if (current) {
//       current.scrollTop = current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage = input.trim();
//     const updatedMessages = [
//       ...messages,
//       { role: "user" as const, content: userMessage },
//     ];
//     setMessages(updatedMessages);
//     setInput("");
//     setIsLoading(true);

//     try {
//     } catch (err) {
//       console.error("OpenAI API Error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="fixed z-50 bottom-4 right-4">
//       {isOpen ? (
//         <Card className="shadow-lg w-80 md:w-96">
//           <CardHeader className="p-4 border-b">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg font-medium">
//                 Chat Assistant
//               </CardTitle>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleChat}
//                 className="w-8 h-8"
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent
//             ref={chatContainerRef}
//             className="p-4 overflow-y-auto h-80"
//           >
//             {messages.length === 0 ? (
//               <div className="flex items-center justify-center h-full text-muted-foreground">
//                 <p>How can I help you today?</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={cn(
//                       "flex",
//                       message.role === "user" ? "justify-end" : "justify-start",
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "max-w-[80%] rounded-lg p-3",
//                         message.role === "user"
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-muted",
//                       )}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//           <CardFooter className="p-3 border-t">
//             <form
//               onSubmit={handleSubmit}
//               className="flex items-center w-full space-x-2"
//             >
//               <Input
//                 value={input}
//                 onChange={(e: any) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1"
//                 disabled={isLoading}
//               />
//               <Button type="submit" size="icon" disabled={isLoading}>
//                 <Send className="w-4 h-4" />
//               </Button>
//             </form>
//           </CardFooter>
//         </Card>
//       ) : (
//         <Button
//           onClick={toggleChat}
//           size="icon"
//           className="w-12 h-12 rounded-full shadow-lg"
//         >
//           <MessageCircle className="w-6 h-6" />
//         </Button>
//       )}
//     </div>
//   );
// };
"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.result },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not get a response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 bottom-4 right-4">
      {isOpen ? (
        <Card className="shadow-lg w-80 md:w-96">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">AI Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent
            ref={chatContainerRef}
            className="p-4 overflow-y-auto h-80 space-y-4"
          >
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground mt-10 text-sm">
                Ask me anything!
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2 text-sm animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-12 w-12 rounded-full shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
