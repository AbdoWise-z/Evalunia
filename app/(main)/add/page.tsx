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

const Page = () => {
  const [url, setURL] = useState<string>('');

  const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const urlAsString = url.toString();
    console.log('URL:', urlAsString);

    setTimeout(() => {
      setURL('');
    }, 1000);

    async function scrapeHTML(URL: string) {
      try {
        // Replace this URL with your actual Cloudflare Worker URL
        const workerURL = 'https://html-scraper.zekee981.workers.dev/';

        const response = await fetch(workerURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: URL }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlContent = await response.text();
        return htmlContent;
      } catch (error) {
        console.error('Error scraping HTML:', error);
        return null;
      }
    }

    try {
      const htmlContent = await scrapeHTML(urlAsString);
      if (htmlContent) {
        console.log(htmlContent);
      } else {
        console.log('Failed to scrape HTML.');
      }
    } catch (error) {
      console.error('Error scraping HTML:', error);
    }
  };


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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted');
    const tags = values.tags?.split(',').map(tag => tag.trim());
  };

  return (
    <div className="min-h-screen flex-1 flex flex-col items-center gap-8 sm:gap-10 p-4 sm:p-5 overflow-x-hidden">
      <div className="w-full flex flex-col justify-center shadow-custom-elevation p-6 sm:p-10 rounded-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Add the Professor</h1>
      </div>

      <div className="flex flex-col w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start flex-shrink-0">
            <div
              style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)' }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
              1
            </div>

            {/*TODO: add a separator*/}

          </div>
          <div className={"flex flex-col"}>
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
                      <p className="text-xs sm:text-sm text-muted-foreground ">The URL of
                        the {"professor's"} profile</p>
                      <Button type="submit" className="w-full">Fetch</Button>
                    </div>

                  </form>
                </CardContent>
              </Card>
            </div>

            <div className={"h-12"}/>
          </div>
        </div>

        {/* Rest of the form fields */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start flex-shrink-0">
            <div
              style={{backgroundColor: 'rgba(31, 41, 55, 0.2)'}}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
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
                      <Button type="submit" className="w-full">Submit</Button>
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

export default Page;