import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";

const Page = async () => {
  const user = await currentUserProfile(true);

  return (
    <div className={"h-full flex-1 flex content-center justify-center items-center"}>
      <p> Dashboard !</p>
    </div>
  );
};

export default Page;