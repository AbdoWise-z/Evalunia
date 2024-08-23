import React from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  trigger: number;
}

export const useChatScroll = (
  {
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    trigger,
  } : ChatScrollProps
) => {
  const [isInitiated, setIsInitiated] = React.useState(false);
  React.useEffect(() => {
    const top = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = top?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    }

    top?.addEventListener("scroll", handleScroll);

    return () => {
      top?.removeEventListener("scroll", handleScroll);
    };
  } , [shouldLoadMore , loadMore , chatRef]);

  React.useEffect(() => {
    const bot = bottomRef?.current;
    const top = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!isInitiated && bot){
        setIsInitiated(true);
        return true;
      }

      if (!top) return false;
      const distance = top.scrollHeight - top.clientHeight - top.scrollHeight;
      return distance <= 100;
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bot?.scrollIntoView({
          behavior: "smooth",
        })
      }, 100);
    }
  } , [bottomRef , chatRef , isInitiated , trigger]);
}