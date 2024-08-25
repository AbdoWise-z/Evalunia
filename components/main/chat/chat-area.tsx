"use client";

import React, {createContext, Fragment, useContext, useEffect, useRef, useState} from 'react';
import {Loader2, Send, ServerCrash} from "lucide-react";
import {MessageObject, useChatContext} from "@/components/providers/chat-provider";
import {useChatScroll} from "@/hooks/use-chat-scroll";
import {Message, MessageRole} from "@prisma/client";
import LoadingAnimation from "@/components/main/chat/loading-animation";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ChatMessage} from "@/components/main/chat/chat-message";

type ChatAreaContextProps = {
  TriggerSizeChanged: () => void;
}

const ChatAreaContext = createContext<ChatAreaContextProps>({
  TriggerSizeChanged: () => {},
});


export const useChatResize = () => useContext(ChatAreaContext);

const ChatArea = () => {

  const chatContext = useChatContext();

  const [triggerValue , setTriggerValue] = useState(0);

  const charRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useChatScroll({
    chatRef: charRef,
    bottomRef: botRef,
    shouldLoadMore: chatContext.canLoadMore,
    loadMore: chatContext.loadMore,
    trigger: triggerValue,
  });

  const mTriggerResize = () => {
    setTriggerValue((v) => v + 1);
  }

  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])


  const handleSend = () => {
    if (input.trim()) {
      if (chatContext.sendMessage(input)){
        setInput("");
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (chatContext.state == 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash
          className="h-7 w-7"/>

        <p className="text-zinc-500 dark:text-zinc-300">
          Something went wrong.
        </p>
      </div>
    );
  }

  if (chatContext.state == 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2
          className="h-7 w-7 text-zinc-500 animate-spin"/>

        <p className="text-zinc-500 dark:text-zinc-300">
          Loading chat ...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-[100%] md:w-[80%] lg:w-[60%] xl:w-[50%] mx-auto text-foreground">
      <header className="flex justify-between items-center py-4 px-6 border-b">
        <h1 className="text-2xl font-bold">Chat AI</h1>
      </header>
      <ScrollArea className="flex-grow px-4 py-3" ref={charRef}>
        {chatContext.hasNextPage && (
          <div className="flex justify-center">
            {chatContext.isFetchingNextPage && (
              <Loader2
                className="h-6 w-6 text-zinc-500 animate-spin my-4"
              />
            )}
            {!chatContext.isFetchingNextPage && (
              <button
                onClick={() => chatContext.loadMore()}
                className="my-4"
              >
                Load Previous messages
              </button>
            )}
          </div>
        )}

        <ChatAreaContext.Provider value={{
          TriggerSizeChanged: mTriggerResize,
        }}>
          <div className="flex flex-col-reverse">
            {chatContext.data?.pages?.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.items.map((item: MessageObject, itemIdx : number) => (
                  <>
                    <ChatMessage
                      key={item.message.id}
                      content={item.message.content}
                      sender={item.message.role == MessageRole.AI ? 'ai' : 'user'}
                      animate={item.message.role == "AI" && pageIndex == 0 && itemIdx == 0}
                      attachments={item.attachments}
                    />
                    <div className={"h-3"}/>
                  </>
                ))}
              </Fragment>
            ))}
          </div>
        </ChatAreaContext.Provider>
        { (chatContext.isSendingMessage) && (
          <div className={"flex w-full group mt-2"}>
            <div className={cn(
              "relative group flex w-fit rounded-t-xl max-w-[calc(95% - 24px)] bg-muted text-primary-foreground rounded-lg justify-center px-2 py-2",
            )}>
              <LoadingAnimation className={"w-8 h-8 mx-4"}/>
            </div>
          </div>
        )}

        <div ref={botRef}/>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="pr-12 resize-none min-h-[50px] max-h-[200px] overflow-y-auto"
            rows={1}
          />
          <Button
            onClick={handleSend}
            type="submit"
            size="icon"
            className="absolute right-2 bottom-1"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;