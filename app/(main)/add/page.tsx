import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import AddPage from "@/app/(main)/add/page-inner";

const Page = async () => {
  const user = await currentUserProfile(true);
  if (!user) {
    return <p> redirecting ...</p>;
  }

  return <AddPage />
};

export default Page;