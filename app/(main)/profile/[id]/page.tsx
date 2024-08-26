import React from 'react';
import { Button } from '@/components/ui/button';
import {db} from "@/lib/db";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Review from "@/components/main/profile/review";
import {ProfessorWithReviewsWithUsers} from "@/lib/db-helper";
import Link from "next/link";
import {SignedIn} from "@clerk/nextjs";


const ProfilePage = async ({ params }: { params: { id: string } }) => {
  async function getProfessor() {
    const professor = await db.professor.findUnique({
      where: {
        id: params.id,
      },
      include: {
        Reviews: {
          include: {
            user: true,
          },
        },
      },
    }) as ProfessorWithReviewsWithUsers;

    const avgRating =
      (professor?.Reviews?.reduce((acc, review) => acc + review.Rating, 0) || 0) /
      (professor?.Reviews?.length || 1);

    const stars = [0,0,0,0,0,0];
    professor?.Reviews?.forEach(review => {
      stars[Math.round(Math.max(Math.min(4 , review.Rating - 1) , 0))]++;
    })


    const reviewsCount = professor?.Reviews?.length || 0;

    if (reviewsCount) {
      stars[0] = Math.round(stars[0] / reviewsCount * 100);
      stars[1] = Math.round(stars[1] / reviewsCount * 100);
      stars[2] = Math.round(stars[2] / reviewsCount * 100);
      stars[3] = Math.round(stars[3] / reviewsCount * 100);
      stars[4] = Math.round(stars[4] / reviewsCount * 100);
    }

    return {
      ...professor,
      avgRating,
      reviewsCount,
      tags: professor?.tags || [],
      stars,
    };
  }

  const professor = await getProfessor();

  if (!professor) {
    return <p>Professor not found</p>;
  }

  return (
    <div className="flex flex-col p-4 overflow-auto">
      {/* Header Section */}
      <div className="flex gap-4 mb-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
        <Avatar className={"w-16 h-16"}>
          <AvatarImage src={professor.imageUrl || undefined} alt={professor.name}/>
          <AvatarFallback>{professor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex gap-4">
          <div className="flex flex-col justify-center">
            <p className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Dr. {professor.name}
            </p>
            <p className="text-foreground text-base font-normal leading-tight tracking-[-0.015em]">
              {professor.qualifications || 'Professor'}
            </p>
          </div>
        </div>
        {/* maybe one day idk .. <div>*/}
        {/*  <Button*/}
        {/*    size="icon"*/}
        {/*    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full p-2 bg-muted text-foreground text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-400"*/}
        {/*  >*/}
        {/*    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"*/}
        {/*         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"*/}
        {/*         className="lucide lucide-heart">*/}
        {/*      <path*/}
        {/*        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>*/}
        {/*    </svg>*/}
        {/*    <span className={"sr-only"}>Favorite</span>*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

      <div className={"flex flex-wrap gap-x-8 gap-y-6 p-4"}>
        <div className="flex flex-col gap-2">
          <p className="text-foreground text-4xl font-black leading-tight tracking-[-0.033em]">{professor.avgRating}</p>
          <div className="flex gap-0.5">
            <div className="text-foreground" data-icon="Star" data-size="18px" data-weight="fill">
              {professor.avgRating >= 1 ? <FilledStar/> : <HollowStar/>}
            </div>
            <div className="text-foreground" data-icon="Star" data-size="18px" data-weight="fill">
              {professor.avgRating >= 1.5 ? <FilledStar/> : <HollowStar/>}
            </div>
            <div className="text-foreground" data-icon="Star" data-size="18px" data-weight="fill">
              {professor.avgRating >= 2.5 ? <FilledStar/> : <HollowStar/>}
            </div>
            <div className="text-foreground" data-icon="Star" data-size="18px" data-weight="fill">
              {professor.avgRating >= 3.5 ? <FilledStar/> : <HollowStar/>}
            </div>
            <div className="text-foreground" data-icon="Star" data-size="18px" data-weight="regular">
              {professor.avgRating >= 4.5 ? <FilledStar/> : <HollowStar/>}
            </div>
          </div>
          <p className="text-white text-base font-normal leading-normal">{professor.reviewsCount} Reviews</p>
        </div>

        <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
          <p className="text-foreground/80 text-sm font-normal leading-normal">5</p>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="rounded-full dark:bg-white bg-black" style={{
              width: `${professor.stars[4]}%`,
            }}></div>
          </div>
          <p className="text-foreground text-sm font-normal leading-normal text-right">{professor.stars[4]}%</p>
          <p className="text-foreground/80 text-sm font-normal leading-normal">4</p>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="rounded-full dark:bg-white bg-black" style={{
              width: `${professor.stars[3]}%`,
            }}></div>
          </div>
          <p className="text-foreground text-sm font-normal leading-normal text-right">{professor.stars[3]}%</p>
          <p className="text-foreground/80 text-sm font-normal leading-normal">3</p>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="rounded-full dark:bg-white bg-black" style={{
              width: `${professor.stars[2]}%`,
            }}></div>
          </div>
          <p className="text-foreground text-sm font-normal leading-normal text-right">{professor.stars[2]}%</p>
          <p className="text-foreground/80 text-sm font-normal leading-normal">2</p>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="rounded-full dark:bg-white bg-black" style={{
              width: `${professor.stars[1]}%`,
            }}></div>
          </div>
          <p className="text-foreground text-sm font-normal leading-normal text-right">{professor.stars[1]}%</p>
          <p className="text-foreground/80 text-sm font-normal leading-normal">1</p>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="rounded-full dark:bg-white bg-black" style={{
              width: `${professor.stars[0]}%`,
            }}></div>
          </div>
          <p className="text-foreground text-sm font-normal leading-normal text-right">{professor.stars[0]}%</p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex gap-3 flex-wrap pr-4 mb-6">
        {professor.tags.map((tag: string) => (
          <div key={tag}
               className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
            <p className="text-foreground text-sm font-medium leading-normal">{tag}</p>
          </div>
        ))}
      </div>

      {/* Biography Section */}
      <div className="pr-4">
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Biography</h2>
        <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1">
          {professor.summary || 'No biography available.'}
        </p>
      </div>

      <div className="pr-4 flex flex-col gap-2">
        <div className={"flex flex-row items-center"}>
          <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Reviews</h2>
          <SignedIn>
            <Link href={`/profile/${params.id}/review`} className={"ml-auto md:mr-[20%]"}>
              <Button className={"rounded-full"} variant={"default"}>
                Review
              </Button>
            </Link>
          </SignedIn>
        </div>

        {...professor.Reviews.map((e , index) => (
          <Review key={index} content={e.review} user={{
            name: e.user.name,
            image: e.user.imageUrl
          }} rating={e.Rating}/>
        ))}

        {professor.Reviews.length == 0 && <p className={"text-secondary-foreground"}>No student submitted any review yet!</p>}
      </div>
    </div>
  );
};

const HollowStar = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor"
              viewBox="0 0 256 256">
    <path
      d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
    ></path>
  </svg>
}

const FilledStar = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor"
              viewBox="0 0 256 256">
    <path
      d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
    ></path>
  </svg>
}

export default ProfilePage;