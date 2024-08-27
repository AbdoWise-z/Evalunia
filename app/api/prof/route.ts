import {currentUserProfile} from "@/lib/user-profile";
import {NextResponse} from "next/server";
import {addProfessorToDB, removeProfessorSummaryEmbeddings} from "@/lib/db-helper";
import {db} from "@/lib/db";

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
      userId: profile.id,
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


export async function DELETE(req: Request, {
}) {
  try {
    const profile = await currentUserProfile();
    const { id } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!id) {
      return new NextResponse("Invalid Params" , {status: 402});
    }


    const del = await removeProfessorSummaryEmbeddings({
      id: id,
      userId: profile.id,
    })

    if (del != 200) {
      if (del == 401) {
        return new NextResponse("Unauthorized" , {status: 401});
      }

      if (del == 404) {
        return new NextResponse("Not found" , {status: 404});
      }

      return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
    }

    await db.professor.delete({
      where: {
        id: id,
      }
    });

    return NextResponse.json(
      {
        status: 200,
      }
    );
  } catch (error){
    console.log("POST [api/scrapper]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}