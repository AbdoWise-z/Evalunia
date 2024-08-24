'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
// import { LampContainer } from "@/components/ui/lamp";
import { Spotlight } from "@/components/ui/Spotlight";
import { ModalType, useModal } from "@/hooks/use-modal";
import Link from "next/link";
import Image from "next/image";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { useOutsideClick } from "@/hooks/use-outside-click";
import ExpandableCardDemo from "@/components/blocks/expandable-card-demo-grid";
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { ThemeProvider } from 'next-themes';

const LandingPage = () => {
  const modal = useModal();
  const testimonials = [
    {
      quote:
        "Professor Smith is an excellent lecturer. Her classes are engaging and she really helps students understand the material.",
    },
    {
      quote:
        "Avoid Professor Jones if you can. His lectures are boring and he's not very responsive to student questions.",
    },
    {
      quote: "Professor Williams is brilliant but his grading is really tough. Be prepared to work hard in his class.",
    },
    {
      quote:
        "I loved taking Professor Garcia's class. He's super knowledgeable and always makes time to help students one-on-one.",
    },
    {
      quote:
        "Professor Patel is kind of hit or miss. Some days his lectures are great, other days it's hard to stay awake.",
    },
  ];




  

  return (
    <ThemeProvider>
    <div className="h-full flex flex-col mb-9">
      {/* Hero Section */}
      <div className='h-full'>
        <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill='white'
          />
          <div className="p-4 max-w-6xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col justify-center h-full">
            <h1 className="text-9xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-950 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50 font-Rafgins">
              Welcome to Evalunia
            </h1>
            <p className="mt-4 font-normal text-2xl  text-neutral-950 dark:text-neutral-300 max-w-lg text-center mx-auto">
              Rate professors, search for their ratings, and make informed decisions.
            </p>

            
          </div>

         
        </div>

        
      </div>


       {/* Testmonia section */}
      <div className="">
      <div className="h-[30vh] rounded-md flex flex-col antialiased bg-white  dark:bg-[#171717] dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
      </div>

      {/* Our Mission section */}
      <div className="mt-8">
      <h2 className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-950 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50 font-Rafgins">
            Our Mission
      </h2>      
      <div
        className="relative bg-cover bg-center h-[90vh]  flex items-center justify-center"
        style={{
          backgroundImage: `url('/images/about2.png')`,
        }}
      >
        <div className="absolute inset-0  rounded-md"></div>
        <div className=''>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
       
         
 
        <p className="text-xl text-neutral-600 text- dark:text-neutral-200">
        Our mission is to empower students and help them make informed decisions about their academic experience. We believe that the quality of instruction is a crucial factor in a student's success, and that's why we've created a platform where students can share their honest feedback and ratings on the professors they've encountered.
        </p>
        
      </BackgroundGradient>
      </div>
      </div>
    </div>

     

      {/* About Section */}
      <div>
      <h2 className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-950 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50 font-Rafgins">
        About Evalunia
      </h2>
      
      <div className="gap-8 p-8 md:p-16 flex-grow">
      
        <div className="flex flex-row justify-center">
        
          <p className="text-center text-xl text-neutral-600 text- dark:text-neutral-200 mb-4">
          Evalunia is a revolutionary platform designed to empower students 
          and foster transparency within the educational landscape. 
          Driven by a deep-rooted commitment to enhancing the academic 
          experience, our mission is to provide students with reliable, 
          unbiased information to make informed decisions about their 
          courses and instructors. At the core of Evalunia's philosophy
          is the belief that open communication and constructive 
          feedback are essential for improving the quality of education. 
          By encouraging students to share their honest experiences through 
          detailed professor ratings and insightful reviews, we aim to 
          inspire academic institutions to continuously refine their 
          offerings and better serve the needs of their students. 
          </p>
          
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/images/s2.png"
            alt="About Evalunia"
            width={700}
            height={500}
            className=""
          />
        </div>
      </div>
      </div>

      {/* <div className="h-full m-10">
      <h1 className="text-6xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 font-Rafgins">
              Our Mission
            </h1>      <div
        className="relative bg-cover bg-center h-[100vh] flex items-center justify-center"
        style={{
          backgroundImage: `url('/images/m.png')`,
        }}
      >
        <div className="absolute inset-0  rounded-md"></div>
        <div className="bg-white rounded-lg p-8 text-center z-10 shadow-lg max-w-md w-full">
          <p className="text-gray-600 mb-6">
          Our mission is to empower students and help them make informed decisions about their academic experience. We believe that the quality of instruction is a crucial factor in a student's success, and that's why we've created a platform where students can share their honest feedback and ratings on the professors they've encountered.
          </p>
          <Button className="px-6 py-3">Learn More</Button>
        </div>
      </div>
      </div> */}

      <div className=''>
      <h2 className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-950 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50 font-Rafgins">
              Features
      </h2>
        <ExpandableCardDemo />
      </div>

        <div className='h-full'>
          <div className='h-[30vh]'>

          </div>
        </div>
      

    </div>

    </ThemeProvider>

  );
};

export default LandingPage;