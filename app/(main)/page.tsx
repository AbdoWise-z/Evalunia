"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import {ModalType, useModal} from "@/hooks/use-modal";
import axios from "axios";

const LandingPage = () => {
  const modal = useModal();

  const handler = async () => {
    try {
      alert("sending request")
      const res = await axios.get("/api/test");
      alert(`done : ${res.data.id}`);
    } catch (e) {
      alert(e);
    }
  }
  return (
    <div className={"flex flex-col gap-2"}>
      This is the landing page :)
      <div>
        <Button onClick={() => {
          handler();
        }} size="sm" variant={"default"}>
          Click me
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;