import React from 'react';
import ReviewEditor from "@/components/main/profile/review-editor";
import {db} from "@/lib/db";
import {currentUserProfile} from "@/lib/user-profile";
import RedirectToSignInPage from "@/components/main/redirect-to-sign-in-page";

const Page = async ({ params }: { params: { id: string } }) => {

  const user = await currentUserProfile(true);
  if (!user) {
    return <RedirectToSignInPage/>;
  }

  const prof = await db.professor.findUnique({
    where: {
      id: params.id,
    }
  });

  if (!prof) {
    return <p> Prof not found </p>
  }

  const review = await db.review.findFirst({
    where: {
      professorId: params.id,
      userId: user.id,
    },
    include: {
      user: true,
    }
  })

  return (
    <div className="flex flex-col w-full overflow-auto">
      <ReviewEditor prevRating={review?.Rating ?? 0} prevContent={review?.review ?? ""} prof_id={params.id}/>
    </div>
  );
};

export default Page;