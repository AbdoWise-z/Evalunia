import { PrismaClient } from '@prisma/client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';



const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const prisma = new PrismaClient();


async function getProfessor(id: string) {
  const professor = await prisma.professor.findUnique({
    where: {
      id: params.id,
    },
    include: {
      Reviews: {
        include: {
          user: true,
        }
      }
    }
  });


  
  const avgRating =
  (professor?.Reviews?.reduce((acc, review) => acc + review.Rating, 0) || 0) /
  (professor?.Reviews?.length || 1);

const reviewsCount = professor?.Reviews?.length || 0;


  return {
    ...professor,
    avgRating,
    reviewsCount,
    tags: professor?.tags || [], 
  };
}

  const professor =await getProfessor(params.id); 

  if (!professor) {
    return <p>Professor not found</p>;
  }

  return (
    <div className="flex flex-col p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
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
        <div>
        <Button
          variant="ghost"
          size="icon"
          className="flex min-w-[44px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-muted text-foreground text-sm font-bold leading-normal tracking-[0.015em] "
        >
          <HeartIcon className="h-5 w-5" />
          <span className="sr-only">Favorite</span>
        </Button>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex flex-wrap gap-x-8 gap-y-6 mb-6">
        <div className="flex flex-col gap-2">
          <p className="text-foreground text-4xl font-black leading-tight tracking-[-0.033em]">
            {professor.avgRating?.toFixed(1) || 'N/A'}
          </p>
          <p className="text-foreground text-base font-normal leading-normal">
            {professor.reviewsCount || 0} reviews
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex gap-3 flex-wrap pr-4 mb-6">
        {professor.tags.map((tag: string) => (
          <div key={tag} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
            <p className="text-foreground text-sm font-medium leading-normal">{tag}</p>
          </div>
        ))}
      </div>

      {/* Biography Section */}
      <div className="px-4">
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Biography</h2>
        <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1">
          {professor.summary || 'No biography available.'}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
