import React from 'react';
import ChatProvider from "@/components/providers/chat-provider";
import ChatArea from "@/components/main/chat/chat-area";

const ChatPage = () => {
  return (
    <div className={"h-full flex-1 flex content-center justify-center items-center"}>
      <ChatProvider>
        <ChatArea />
      </ChatProvider>
    </div>
  );
};

export default ChatPage;