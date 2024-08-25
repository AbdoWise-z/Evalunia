"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios'; // Import axios in JS



const Page = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [url, setURL] = useState<string>('');


  const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const urlAsString = url.toString();
    console.log('URL:', urlAsString);
  
    // Reset the URL state to clear the input field
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


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value.split(',').map(tag => tag.trim()));
  };




  return (
    <div className="min-h-screen flex-1 flex flex-col items-center gap-8 sm:gap-10 p-4 sm:p-5 overflow-x-hidden">
      <div className="w-full flex flex-col justify-center shadow-custom-elevation p-6 sm:p-10 rounded-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Add the Professor</h1>
      </div>

      <div className="flex flex-col gap-12 sm:gap-20 w-full sm:w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start flex-shrink-0">
            <div
              style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)' }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
              1
            </div>
          </div>
          <div className='w-full shadow-custom-elevation rounded-2xl'>
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', border: 0 }} className="flex-grow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Add Professor via URL</CardTitle>
                <CardDescription className="text-sm sm:text-base">Enter the URL of the professor's profile to automatically fill in the details.</CardDescription>
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
                      required />
                    <p className="text-xs sm:text-sm text-muted-foreground ">The URL of the professor's profile</p>
                    <Button type="submit" className="w-full">Fetch</Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rest of the form fields */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start flex-shrink-0">
            <div
              style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)' }}
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
                <CardDescription className="text-sm sm:text-base">Enter the details for the professor. Fields marked with an asterisk (*) are required.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                    <Input id="email" type="email" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm sm:text-base">Image URL</Label>
                    <Input id="imageUrl" type="url" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm sm:text-base">Address</Label>
                    <Input id="address" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone</Label>
                    <Input id="phone" type="tel" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm sm:text-base">Tags (comma-separated)</Label>
                    <Input id="tags" onChange={handleTagsChange} />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school" className="text-sm sm:text-base">School</Label>
                    <Input id="school" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm sm:text-base">Birth Date</Label>
                    <Input id="birthDate" type="date" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualifications" className="text-sm sm:text-base">Qualifications</Label>
                    <Input id="qualifications" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Optional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-sm sm:text-base">Summary *</Label>
                    <Textarea id="summary" required placeholder="A summary about the professor's personality, life, etc..." />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Submit</Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
