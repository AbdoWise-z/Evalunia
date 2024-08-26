import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {Message, Professor} from "@prisma/client";
import {db} from "@/lib/db";
import {getAIResponseTo} from "@/app/api/chat/llama-helper";

const DefaultPatchSize = 20;
const MaxPatchSize = 40;

export async function GET(req: Request, {
}) {
  try {
    const { searchParams } = new URL(req.url);
    const profile = await currentUserProfile();
    const cursor = searchParams.get("cursor");
    const patch = parseInt(searchParams.get("patch") ?? `${DefaultPatchSize}`);
    const patchSize = patch < MaxPatchSize ? patch : MaxPatchSize;
    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    let messages: Message[];
    if (cursor){
      messages = await db.message.findMany({
        take: patchSize,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          senderId: profile.id,
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    } else {
      messages = await db.message.findMany({
        take: patchSize,
        where: {
          senderId: profile.id,
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    }

    let nextCursor = null;
    if (messages.length === patchSize){
      nextCursor = messages[patchSize - 1].id;
    }

    let attachments: Professor[][] = [];
    for (const message of messages) {
      let profs: Professor[] = [];
      for (const profId of message.referencedProfs){
        const prof = await db.professor.findUnique({
          where: {
            id: profId,
          },
        })
        if (!prof){
          profs.push({
            id: "deleted",
            name: "Not found",
            summary: "Seems like this professor was deleted from our database",
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Professor);
          continue;
        }

        profs.push(prof);
      }

      attachments.push(profs);
    }

    return NextResponse.json(
      {
        items: messages.map((m , i) => {
          return {
            message: m,
            attachments: attachments[i],
          }
        }),
        nextCursor: nextCursor,
      }
    );
  } catch (error){
    console.log("GET [api/chat]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}


export async function POST(req: Request, {
}) {
  try {
    const profile = await currentUserProfile();
    const data = await req.json();
    const content = data["content"];
    if (!profile) {
      return new NextResponse("Unauthorized" , {status: 401});
    }

    if (!content || content.length > 512) {
      return new NextResponse("Invalid Params" , {status: 402});
    }



    // get the last 8 messages
    const messages = await db.message.findMany({
      take: 8,
      where: {
        senderId: profile.id,
      },
      orderBy: {
        createdAt: "desc",
      }
    })

    const userMessage = await db.message.create({
      data: {
        content: content,
        senderId: profile.id,
        role: "User",
      }
    })

    const aiRes = await getAIResponseTo({
      history: messages,
      currentMessage: content,
    });


    const finalUserMessage = await db.message.update({
      where: {
        id: userMessage.id,
      },
      data: {
        contentDB: aiRes.contentDB,
      }
    })

    const aiMessage = await db.message.create({
      data: {
        content: aiRes.text,
        senderId: profile.id,
        role: "AI",
        referencedProfs: aiRes.professors.map((i) => {
          return i.id;
        }),
      }
    })

    let attachment: Professor[] = [];
    for (const profId of aiMessage.referencedProfs){
      const prof = await db.professor.findUnique({
        where: {
          id: profId,
        },
      })
      if (!prof){
        attachment.push({
          id: "deleted",
          name: "Not found",
          summary: "Seems like this professor was deleted from our database",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Professor);
        continue;
      }

      attachment.push(prof);
    }

    return NextResponse.json(
      {
        userMessage: finalUserMessage,
        AiResponse: aiMessage,
        attachment: attachment,
      }
    );
  } catch (error){
    console.log("POST [api/chat]" , error);
    return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
  }
}