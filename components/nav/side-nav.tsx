"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconBrandTabler,
  IconLogin,
  IconMessageChatbot,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import {User} from "@prisma/client";
import { motion } from "framer-motion";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {usePathname} from "next/navigation";

export function SideNav(
  {
    currentUser,
  } : {
    currentUser: User | null,
  }
) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  console.log(pathname);

  const links = [
    {
      label: "Search",
      href: "/search",
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chat with AI",
      href: "/chat",
      icon: (
        <IconMessageChatbot className={cn(
          "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0",
        )} />
      ),
    },
  ];

  const linksGroup2 = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Add Professor",
      href: "/add",
      icon: (
        <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (

    <Sidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10 shadow-md">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo/> : <LogoIcon/>}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} className={cn(
                "pl-2 rounded-full",
                (pathname == link.href) && "dark:bg-neutral-900 bg-neutral-300",
              )}/>
            ))}
          </div>

          <Separator className={"w-full h-0.5 bg-neutral-700 mr-4 my-2"}/>

          <div className="flex flex-col gap-2">
            {linksGroup2.map((link, idx) => (
              <SidebarLink key={idx} link={link} className={cn(
                "pl-2 rounded-full",
                (pathname == link.href) && "dark:bg-neutral-900 bg-neutral-300",
              )}/>
            ))}
          </div>
        </div>

        <div>
          <ThemeToggle />
          <SignedIn>
            <SidebarLink
              link={{
                label: currentUser?.name ?? "",
                href: "#",
                icon: (
                  <UserButton />
                ),
              }}
            />
          </SignedIn>
          <SignedOut>
            <SidebarLink
              className={"pl-2"}
              link={{
                label: "Login",
                href: "/sign-in",
                icon: (
                  <IconLogin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
          </SignedOut>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Evalunia
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

