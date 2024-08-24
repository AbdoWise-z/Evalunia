"use client";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React, {useEffect, useState} from "react";
import {useChatResize} from "@/components/main/chat/chat-area";
import {delay} from "@/lib/utils";
import {Professor} from "@prisma/client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";

type ChatMessageProps = {
  content: string
  sender: 'user' | 'ai',
  animate?: boolean,
  attachments: Professor[],
}

export function ChatMessage({ content, sender , animate , attachments }: ChatMessageProps) {
  const [dispContent, setDispContent] = useState("");
  const [Copy , setCopy] = useState(false);
  const resize = useChatResize();

  const animateText = async () => {
    const words = content.split(" ");
    let str = "";
    for (const word of words) {
      if (str.length == 0){
        str = word;
      } else {
        str = str + " " + word;
      }

      setDispContent(str);
      await delay(20);
      resize.TriggerSizeChanged();
    }
  }
  useEffect(() => {
    if (animate){
      animateText();
    }
    resize.TriggerSizeChanged();
  }, []);

  return (
    <div className={`flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] p-3 rounded-lg ${
          sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
            ul: ({children}) => <ul className="list-disc pl-4 mb-1">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal pl-4 mb-1">{children}</ol>,
            li: ({children}) => <li className="mb-0.5">{children}</li>,
            code: (props) => {
              const {children, className, node, ...rest} = props
              return (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            }
          }}
          className="text-inherit text-sm"
        >
          {animate ? dispContent : content}
        </ReactMarkdown>
      </div>

      { attachments.length > 0 &&
        <div className={"flex flex-wrap gap-2 pt-2 "}>
          {attachments.map((prof, index) => (
            <Link
              key={index}
              href={`/profile/${prof.id}`}
              className={"border-2 border-transparent hover:border-muted transition-all rounded-lg"}
              rel={'noopener noreferrer'}
              prefetch={false}>
              <div className="flex items-center space-x-4 bg-card text-card-foreground p-2 rounded-lg shadow-md dark:shadow-sm">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={prof.imageUrl || undefined} alt={prof.name}/>
                  <AvatarFallback>{prof.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{prof.name}</p>
                  <p
                    className="text-sm text-muted-foreground">{prof.email ?? prof.phone ?? prof.address ?? "No Contact Info"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      }

    </div>
  )
}