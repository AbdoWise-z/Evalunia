import React from 'react';
import {cn} from "@/lib/utils";
import {SideNav} from "@/components/nav/side-nav";
import ModalProvider from "@/components/providers/modal-provider";

const MainLayout = (
  { children } : {children: React.ReactNode}
) => {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen w-screen"
      )}
    >
      <ModalProvider />
      <SideNav />
      <div className={"flex flex-1"}>
        <div className="p-2 md:p-4 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;