import React from 'react';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';

const ProfilePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col p-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
        <div className="flex gap-4">
          <div className="flex flex-col justify-center">
            <p className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Dr. Maria Gagliano
            </p>
            <p className="text-muted text-base font-normal leading-normal">
              Professor of Astronomy
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex min-w-[44px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-muted text-foreground text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto"
        >
          <HeartIcon className="h-5 w-5" />
          <span className="sr-only">Favorite</span>
        </Button>
      </div>

      {/* Rating Section */}
      <div className="flex flex-wrap gap-x-8 gap-y-6 mb-6">
        <div className="flex flex-col gap-2">
          <p className="text-foreground text-4xl font-black leading-tight tracking-[-0.033em]">4.6</p>
          <div className="flex gap-0.5">
            {/* Star Icons */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-foreground" data-icon="Star" data-size="18px" data-weight="fill">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                </svg>
              </div>
            ))}
            <div className="text-foreground" data-icon="Star" data-size="18px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
              </svg>
            </div>
          </div>
          <p className="text-foreground text-base font-normal leading-normal">60 reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
          {[
            { score: 5, width: '57%', percentage: '57%' },
            { score: 4, width: '23%', percentage: '23%' },
            { score: 3, width: '12%', percentage: '12%' },
            { score: 2, width: '3%', percentage: '3%' },
            { score: 1, width: '5%', percentage: '5%' },
          ].map((rating) => (
            <React.Fragment key={rating.score}>
              <p className="text-foreground text-sm font-normal leading-normal">{rating.score}</p>
              <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="rounded-full bg-foreground" style={{ width: rating.width }}></div>
              </div>
              <p className="text-muted text-sm font-normal leading-normal text-right">{rating.percentage}</p>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tag Section */}
      <div className="flex gap-3 flex-wrap pr-4 mb-6">
        {['Engaging', 'Clear', 'Supportive', 'Grading', 'Accessible', 'Hilarious', 'Caring', 'Respected'].map((tag) => (
          <div key={tag} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-muted pl-4 pr-4">
            <p className="text-foreground text-sm font-medium leading-normal">{tag}</p>
          </div>
        ))}
      </div>

      {/* Biography Section */}
      <div className="px-4">
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Biography</h2>
        <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1">
          Maria Gagliano is a professor in the Astronomy department at Stanford University - see what their students are saying. Maria Gagliano is a professor in the Astronomy department at Stanford University - see what their students are saying. Maria Gagliano is a professor in the Astronomy department at Stanford University - see what their students are saying.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
