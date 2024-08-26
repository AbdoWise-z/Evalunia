import {currentUserProfile} from "@/lib/user-profile";
import {NextResponse} from "next/server";
import {addProfessorToDB} from "@/lib/db-helper";

const dataOrUndefined = (data: string | null | undefined) => {
  if (data && data.length){
    return data;
  }
  return undefined;
}

export async function POST(req: Request, {
}) {
  try {
    const profile = await currentUserProfile();
    const data = await req.json();


    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!data.name || data.name.length > 512 || !data.summary || data.summary.length > 2048) {
      return new NextResponse("Invalid Params" , {status: 402});
    }

    const res = await addProfessorToDB({
      name: data.name,
      summary: data.summary,
      address: dataOrUndefined(data.address.length),
      birthDate: data.birthDate.length > 0 ? new Date(data.birthDate) : undefined,
      email: dataOrUndefined(data.email),
      phone: dataOrUndefined(data.phone),
      tags: data.tags,
      school: dataOrUndefined(data.school),
      imageUrl: dataOrUndefined(data.imageUrl),
      qualifications: dataOrUndefined(data.qualifications),
    })

    return NextResponse.json(
      {
        status: 200,
        id: res,
      }
    );
  } catch (error){
    console.log("POST [api/scrapper]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}