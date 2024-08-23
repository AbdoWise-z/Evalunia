"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";

import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ModalType, useModal} from "@/hooks/use-modal";
import {useEffect} from "react";

const formSchema = z.object({
  name: z.string().min(1 , {
    message: "Server name is required",
  }).max(100),
  count: z.coerce.number({
    message: "quantity is required",
  }).int({
    message: "Must be an integer number",
  }).min(1,{
    message: "Must be greater than one"
  }),
});

export const EditItemModal = () => {

  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.EDIT_ITEM;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      count: 1
    }
  });

  useEffect(() => {

  } , [form , modal.data])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    form.reset();
    modal.close();
  };

  const handleClose = () => {
    form.reset();
    modal.close();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open?) => {
      handleClose();
    }}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6" >
          <DialogTitle className="text-2xl text-center font-bold" >
            Edit item
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-8 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Item name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 space-x-0 space-y-0 px"
                        placeholder="enter item name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="count"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 space-x-0 space-y-0 px"
                        placeholder="enter a positive number"
                        type={"number"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-2 py-6">
              <Button disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}