import React from 'react';
import { cn } from "@/lib/utils";
import { SideNav } from "@/components/nav/side-nav";
import ModalProvider from "@/components/providers/modal-provider";
import { currentUserProfile } from "@/lib/user-profile";

const MainLayout = async (
  { children }: { children: React.ReactNode }
) => {
  const user = await currentUserProfile(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-full ",
        "border border-neutral-200 dark:border-neutral-700"
      )}
    >
      <ModalProvider />
      <SideNav currentUser={user} />
      <div className="flex flex-1">
        <div
          className="p-2 md:p-4 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
