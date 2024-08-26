"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {Loader2} from "lucide-react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  tags: z.string().optional(),
  school: z.string().optional(),
  birthDate: z.string().optional(),
  qualifications: z.string().optional(),
  summary: z.string().min(1, { message: "Summary is required" }),
});

const AddPage = () => {
  const router = useRouter();

  const [url, setURL] = useState<string>('');
  const [submittingUrl, setSubmittingURL] = useState<number>(0);
  const [urlError, setUrlError] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      imageUrl: '',
      address: '',
      phone: '',
      tags: '',
      school: '',
      birthDate: '',
      qualifications: '',
      summary: '',
    },
  });


  const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const urlAsString = url.toString();
    console.log('URL:', urlAsString);
    setSubmittingURL(1);

    async function doRequest() {
      try {
        const res = await axios.post("/api/scrapper" , {
          url: urlAsString,
        });

        console.log(res.data);
        const data = res.data;
        if (data.status === 200) {
          setUrlError("")
          return data.data;
        } else {
          setUrlError("Failed to load data from the website. maybe try another one.")
          return null;
        }
      } catch (error) {
        setUrlError("Failed to process your request, maybe check your internet ?")
        return null;
      }
    }

    const data = await doRequest();
    //load the data
    if (data) {
      let tags = "";
      if (data.tags) {
        data.tags.forEach( (tag: string)=> {
          tags += tag + ", ";
        })
      }

      if (tags.length > 0) { //remove the last ", "
        tags = tags.substr(0, tags.length - 2);
      }

      form.setValue("name", data.name as string);
      form.setValue("email", (data.email || form.getValues("email")) as string);
      form.setValue("imageUrl", (data.imageUrl || form.getValues("imageUrl")) as string);
      form.setValue("address", (data.address || form.getValues("address")) as string);
      form.setValue("phone", (data.phone || form.getValues("phone")) as string);
      form.setValue("tags", (data.tags ? tags : form.getValues("tags")) as string);
      form.setValue("school", (data.school || form.getValues("school")) as string);
      form.setValue("birthDate", (data.birthDate || form.getValues("birthDate")) as string);
      form.setValue("qualifications", (data.qualifications || form.getValues("qualifications")) as string);
      form.setValue("summary", (data.summary || form.getValues("summary")) as string);
      setTimeout(() => {
        document.getElementById("first_step_end")?.scrollIntoView({
          behavior: "smooth",
        });
      } , 400);
      setSubmittingURL(2);
    } else {
      setSubmittingURL(0);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted');
    const tags = values.tags?.split(',').map(tag => tag.trim());
    try {
      const res = await axios.post("/api/add" , {
        ...values,
        tags: tags,
      });

      if (res.data.status === 200) {
        toast("Added Professor!", {
          description: "Your professor data has been added, check out their page!",
          action: {
            label: "Lets Go",
            onClick: () => {
              router.push(`/profile/${res.data.id}`);
            },
          },
        })

        form.reset();
      } else {
        toast("Something we dont know went wrong ....", {
          description: "Hmm",
          action: {
            label: "OK",
            onClick: () => {},
          },
        })
      }
    } catch (e) {
      toast("Failed to add professor", {
        description: "Seems like an internet error has happened",
        action: {
          label: "OK",
          onClick: () => {},
        },
      })
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-8 sm:gap-10 p-4 sm:p-5 overflow-x-hidden">

      <div className="flex flex-col w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center flex-col flex-shrink-0">
            <div
              style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)' }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-black dark:border-white">
              1
            </div>

            <div className="w-0.5 flex-1 overflow-clip hidden md:block ">
              <Separator className={cn(
                "w-0.5 h-full dark:bg-white bg-black transition-all",
                "opacity-0 translate-y-[-100%] duration-500",
                (submittingUrl == 2) && "opacity-100 translate-y-[0px]",
              )}/>
            </div>
          </div>
          <div className={"flex flex-col w-full"}>
            <div className='w-full shadow-custom-elevation rounded-2xl'>
              <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.01)', border: 0}} className="flex-grow rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Add Professor via URL</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Enter the URL of the {"professor's"} profile to
                    automatically fill in the details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUrlSubmit}>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="url" className="text-sm sm:text-base">URL</Label>
                      <Input name="url"
                             type="url"
                             placeholder="Enter professor's profile URL"
                             value={url}
                             onChange={(e) => setURL(e.target.value)}
                             required/>
                      <p className={"text-xs sm:text-sm text-red-500"}>{urlError}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground ">The URL of
                        the {"professor's"} profile</p>

                      { (submittingUrl == 2) && <p className={"text-xs sm:text-sm text-green-400"}>Professor data loaded !</p>}

                      <div className={"ml-auto flex"}>
                        <Button type="submit" className={"ml-auto"} disabled={(submittingUrl == 1)}>
                          Fetch
                          {(submittingUrl == 1) && (<div>
                            <Loader2 className="ml-2 w-4 h-4 animate-spin"/>
                          </div>)}
                        </Button>
                      </div>
                    </div>

                  </form>
                </CardContent>
              </Card>
            </div>

            <div className={"h-12"}/>
            <div id={"first_step_end"}/>
          </div>
        </div>

        {/* Rest of the form fields */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start flex-shrink-0">
            <div
              style={{backgroundColor: 'rgba(31, 41, 55, 0.2)'}}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-black dark:border-white">
              2
            </div>
          </div>
          <div className='w-full shadow-custom-elevation rounded-2xl'>
            <Card style={{
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
              border: 0,
            }} className="flex-grow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Professor Information</CardTitle>
                <CardDescription className="text-sm sm:text-base">Enter the details for the professor. Fields marked
                  with an asterisk (*) are required.</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Image URL</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Tags (comma-separated)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">School</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Birth Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="qualifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Qualifications</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground">Optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Summary *</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="A summary about the professor's personality, life, etc..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <div className={"ml-auto"}>
                      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        Submit
                        {form.formState.isSubmitting && (
                          <div>
                            <Loader2 className="ml-2 w-4 h-4 animate-spin"/>
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPage;