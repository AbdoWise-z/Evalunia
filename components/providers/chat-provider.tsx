"use client";

import React, { useContext } from 'react';
import { useChatQuery } from "@/hooks/use-chat";
import {InfiniteData, useQueryClient} from "@tanstack/react-query";
import qs from "query-string";
import axios from "axios";
import {Message, Professor} from "@prisma/client";

type ChatContext = {
  state: string;
  sendMessage: (message: string) => boolean;
  isSendingMessage: boolean;
  canLoadMore: boolean;
  loadMore: () => void;
  data?: InfiniteData<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const chatContext = React.createContext<ChatContext>({
  state: "any",
  sendMessage: (message: string) => {return false;},
  isSendingMessage: false,
  canLoadMore: false,
  loadMore: () => {},
  data: undefined,
  hasNextPage: false,
  isFetchingNextPage: false,
})

export type MessageObject = {
  message: Message,
  attachments: Professor[],
}

const ChatProvider = (
  {
    children
  } : { children: React.ReactNode }
) => {

  const mQueryClient = useQueryClient();
  const mChat = useChatQuery({
    queryKey: "chat"
  });

  const [isSendingMessage, setIsSendingMessage] = React.useState(false);

  const addMessageToQuery = (m: MessageObject) => {
    mQueryClient.setQueryData(["chat"] , (oldData: any) => {
      if (!oldData || !oldData.pages || oldData.pages.length == 0) {
        return {
          pages: [
            {
              items: [m],
            },
          ],
        };
      }

      const newData = [...oldData.pages];
      newData[0] = {
        ...newData[0],
        items: [
          m,
          ...newData[0].items,
        ]
      }

      return {
        ...oldData,
        pages: newData
      };

    });
  }

  const updateLoadingMessage = (m: MessageObject) => {
    mQueryClient.setQueryData(["chat"] , (oldData: any) => {
      if (!oldData || !oldData.pages || oldData.pages.length == 0) {
        return {
          pages: [
            {
              items: [m],
            },
          ],
        };
      }

      const newData = [...oldData.pages];

      newData[0].items = newData[0].items.map((item: any) => {
        if (item.message.id == "") return m;
        return item;
      })

      return {
        ...oldData,
        pages: newData
      };

    });
  }

  // const removeLoadingMessage = () => {
  //   mQueryClient.setQueryData(["chat"] , (oldData: any) => {
  //     if (!oldData || !oldData.pages || oldData.pages.length == 0) {
  //       return oldData;
  //     }
  //
  //     const newData = [...oldData.pages];
  //
  //     newData[0].items = newData[0].items.filter((item: any) => {
  //       return item.id != "";
  //     })
  //
  //     console.log(newData[0].items);
  //
  //     return {
  //       ...oldData,
  //       pages: newData
  //     };
  //
  //   });
  // }


  const _sendMessageInternal = async (message: string) => {
    try {
      addMessageToQuery({
        message: {
          role: "User",
          content: message,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: "",
          senderId: "",
          referencedProfs: [],
          contentDB: null
        },
        attachments: [],
      });


      const url = qs.stringifyUrl({
        url: "/api/chat",
      });

      const res = await axios.post(url, {
        "content": message,
      });

      const data = res.data;

      updateLoadingMessage({
        message: data.userMessage,
        attachments: [],
      });

      addMessageToQuery({
        message: data.AiResponse,
        attachments: data.attachment,
      });

      setIsSendingMessage(false);
      return true;
    } catch (error){
      console.log(error);

      updateLoadingMessage({
        message: {
          role: "User",
          content: message,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: "invalid" + Math.random(),
          senderId: "",

          referencedProfs: [],
          contentDB: null,
        },
        attachments: [],
      });

      addMessageToQuery({
        message: {
          role: "AI",
          content: "Failed to send message",
          createdAt: new Date(),
          updatedAt: new Date(),
          id: "invalid" + Math.random(),
          senderId: "",
          referencedProfs: [],
          contentDB: null,
        },
        attachments: [],
      });
      setIsSendingMessage(false);
      return false;
    }
  }

  const sendMessage = (message: string) => {
    if (isSendingMessage){
      return false;
    }
    setIsSendingMessage(true);
    _sendMessageInternal(message);
    return true;
  }

  return (
    <chatContext.Provider value={
      {
        isSendingMessage: isSendingMessage,
        state: mChat.status,
        sendMessage,
        canLoadMore: mChat.hasNextPage && !mChat.isFetchingNextPage,
        loadMore: mChat.fetchNextPage,
        data: mChat.data,
        hasNextPage: mChat.hasNextPage,
        isFetchingNextPage: mChat.isFetchingNextPage,
      }}>
      {children}
    </chatContext.Provider>
  );
};

export default ChatProvider;

export const useChatContext = () => useContext(chatContext);