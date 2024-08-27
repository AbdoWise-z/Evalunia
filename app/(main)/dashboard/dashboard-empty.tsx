"use client";

import React from 'react';
import {BadgeAlert} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const DashboardEmpty = () => {
  const router = useRouter();

  return (
    <div className={"flex flex-col flex-1 w-full h-full items-center content-center justify-center"}>
      <BadgeAlert className={"w-8 h-8"}/>
      <p className={"p-2"}>
        {"Seems like you didn't prof any professors yet, prof some to see their analytics here."}
      </p>

      <Button onClick={() => router.push("/add")} variant="outline" className={"mt-4"}>
        Lets go
      </Button>
    </div>
  );
};

export default DashboardEmpty;