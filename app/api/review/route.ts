import {currentUserProfile} from "@/lib/user-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function POST(req: Request, {
}) {
  try {
    const profile = await currentUserProfile();
    const {review , rating , prof_id} = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!review || review.length > 2048 || !rating || rating < 0 || rating > 5 || !prof_id) {
      return new NextResponse("Invalid Params" , {status: 402});
    }

    const prof = await db.professor.findUnique({
      where: {
        id: prof_id,
      }
    });

    if (!prof) {
      return new NextResponse("Prof not found" , {status: 404});
    }

    const oldReview = await db.review.findFirst({
      where: {
        professorId: prof_id,
        userId: profile.id,
      }
    });

    if (oldReview) {
      await db.review.update({
        where: {
          id: oldReview.id,
        },
        data: {
          review: review,
          Rating: rating,
        },
      })

      await db.$transaction(async (tx) => {
        const prof = await tx.professor.findUnique({
          where: {
            id: prof_id,
          }
        });
        if (!prof) { return }

        await tx.professor.update({
          where: {
            id: prof_id,
          },
          data: {
            totalStars: prof.totalStars + (rating - oldReview.Rating),
            rating: (prof.totalStars + (rating - oldReview.Rating)) / Math.max(prof.totalReviews, 1)
          }
        })
      })

    } else {
      await db.review.create({
        data: {
          review: review,
          Rating: rating,
          professorId: prof_id,
          userId: profile.id,
        },
      });

      await db.$transaction(async (tx) => {
        const prof = await tx.professor.findUnique({
          where: {
            id: prof_id,
          }
        });
        if (!prof) { return }

        await tx.professor.update({
          where: {
            id: prof_id,
          },
          data: {
            totalStars: prof.totalStars + rating,
            totalReviews: prof.totalReviews + 1,
            rating: (prof.totalStars + rating) / (prof.totalReviews + 1)
          }
        })
      })
    }

    return NextResponse.json({
      status: 200,
    })
  } catch (error){
    console.log("POST [api/scrapper]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}