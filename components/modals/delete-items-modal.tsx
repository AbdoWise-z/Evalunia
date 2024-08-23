"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import {ModalType, useModal} from "@/hooks/use-modal";

export const DeleteItemsModal = () => {


  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.DELETE_ITEMS;


  const handleClose = () => {
    modal.close();
  }

  const deleteItems = () => {
    modal.close();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open?) => {
      handleClose();
    }}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6" >
          <DialogTitle className="text-2xl text-center font-bold" >
            Delete Items
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            Are you sure you want to perform this action ? <br/>
            <span className="font-semibold text-indigo-500">{"Items listed blow"}</span> will be permanently deleted. <br/>
            <span className="font-semibold text-rose-400 text-xs">(This action cannot be undone)</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter
          className="bg-gray-100 px-6 py-4">
          <div
            className="flex items-center justify-between w-full"
          >
            <Button
              onClick={() => {
                modal.close();
              }}
              variant="ghost"
            >
              Cancel
            </Button>

            <Button
              onClick={deleteItems}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}