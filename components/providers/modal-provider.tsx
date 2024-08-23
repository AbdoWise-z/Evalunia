"use client";

import React, {useEffect} from 'react';

import {AddItemModal} from "@/components/modals/add-item-modal";
import {EditItemModal} from "@/components/modals/edit-item-modal";
import {DeleteItemsModal} from "@/components/modals/delete-items-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AddItemModal/>
      <EditItemModal />
      <DeleteItemsModal />
    </>
  );
};

export default ModalProvider;