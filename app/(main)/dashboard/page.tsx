import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import Dashboard from "@/app/(main)/dashboard/page-inner";
import {db} from "@/lib/db";

import DashboardEmpty from "@/app/(main)/dashboard/dashboard-empty";

const Page = async () => {
  const currUser = await currentUserProfile(true);
  if (!currUser) {
    return <p> Redirecting ... </p>;
  }

  const profs = await db.professor.findMany({
    where: {
      userId: currUser.id,
    },
  });

  if (profs.length === 0) {
    return (
      <DashboardEmpty/>
    );
  }

  return (
    <Dashboard profs={profs}/>
  );
};

export default Page;