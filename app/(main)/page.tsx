"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import {ModalType, useModal} from "@/hooks/use-modal";

const LandingPage = () => {
  const modal = useModal();

  return (
    <div className={"flex flex-col gap-2"}>
      This is the landing page :)
      <div>
        <Button onClick={() => {
          modal.open(ModalType.ADD_ITEM);
        }} size="sm" variant={"default"}>
          Click me
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;