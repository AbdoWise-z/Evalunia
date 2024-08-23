"use client";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React, {useEffect, useState} from "react";
import {useChatResize} from "@/components/main/chat/chat-area";
import {delay} from "@/lib/utils";

type ChatMessageProps = {
  content: string
  sender: 'user' | 'ai',
  animate?: boolean
}

export function ChatMessage({ content, sender , animate }: ChatMessageProps) {
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
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
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
    </div>
  )
}