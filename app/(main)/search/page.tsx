'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SearchPage = () => {
  const router= useRouter();
  const Handelgetstart= async () =>{
    router.push('/profile/id')  }
  return (
    <div className={"h-full flex-1 flex content-center justify-center items-center"}>
      <p> This is the search page </p>
      <Button onClick={Handelgetstart} size="sm" variant={"default"}>
          Click me
        </Button>
    </div>
  );
};

export default SearchPage;