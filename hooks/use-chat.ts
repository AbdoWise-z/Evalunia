import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";


interface ChatQueryProps {
  queryKey: string;
}

export const useChatQuery = (
  {
    queryKey,
  }: ChatQueryProps
) => {
  const fetchMessages = async ({pageParam = undefined}) => {
    const url = qs.stringifyUrl({
      url: "/api/chat",
      query: {
        cursor: pageParam,
      }
    } , {skipNull: true});

    const res = await fetch(url);
    return res.json();
  }

  const iq = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: lastPage => lastPage?.nextCursor,
    refetchInterval: false,
  })

  const data = iq.data;
  const fetchNextPage = iq.fetchNextPage;
  const hasNextPage = iq.hasNextPage;
  const isFetchingNextPage = iq.isFetchingNextPage;
  const status = iq.status;

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  };
}