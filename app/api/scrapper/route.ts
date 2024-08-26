import {currentUserProfile} from "@/lib/user-profile";
import {NextResponse} from "next/server";
import {Scrap} from "@/app/api/scrapper/scrapper-helper";

export async function POST(req: Request, {
}) {
  try {
    const profile = await currentUserProfile();
    const data = await req.json();
    const url = data["url"];

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!url || url.length > 512) {
      return new NextResponse("Invalid Params" , {status: 402});
    }

    const prof = await Scrap(url);

    return NextResponse.json(
      {
        status: prof ? 200 : 500,
        data: prof,
      }
    );
  } catch (error){
    console.log("POST [api/scrapper]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}