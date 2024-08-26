import React from 'react';
import {Loader2} from "lucide-react";

const Loading = () => {
  return (
    <div className={"flex flex-col flex-1 w-full h-full items-center content-center justify-center"}>
      <Loader2 className={"w-8 h-8 animate-spin"} />
      <p>Loading ...</p>
    </div>
  );
};

export default Loading;