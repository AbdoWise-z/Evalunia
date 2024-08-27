import {db} from "@/lib/db";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {generateEmbeddings, ProfReviewIndex} from "@/lib/pinecone";
import { v4 as uuid } from 'uuid';
import {Professor, Review, User} from "@prisma/client";

export type ReviewWithUser = Review & {
  user: User;
}

export type ProfessorWithReviews = Professor & {
  Reviews: Review[],
}

export type ProfessorWithReviewsWithUsers = Professor & {
  Reviews: ReviewWithUser[],
}

async function splitTextIntoChunks(data: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 64, chunkOverlap: 32,
  });

  return await splitter.createDocuments([data]);
}

export async function addProfessorToDB(
  {
    name,
    email,
    imageUrl,
    address,
    phone,
    tags,
    school,
    birthDate,
    qualifications,
    summary,
    userId,
  } : {
    name: string;
    email?: string;
    imageUrl?: string;
    address?: string;
    phone?: string;
    tags: string[];
    school?: string;
    birthDate?: Date;
    qualifications?: string;
    summary: string;
    userId: string;
  }
) {

  //step 1
  //prof them to the db
  const prof = await db.professor.create({
    data: {
      name,
      email,
      imageUrl,
      address,
      phone,
      tags,
      school,
      birthDate,
      qualifications,
      summary,
      userId,
    }
  });

  //step 2
  //generate embedding vectors
  let tags_str = "";
  tags.forEach((tag) => {
    tags_str += `${tag} `;
  })

  const summaryDocs = await splitTextIntoChunks(
    summary + "\n" +
    "Name: " + name + "\n" +
    "Email: " + (email ?? "") + "\n" +
    "ImageUrl: " + (imageUrl ?? "") + "\n" +
    "Address: " + (address ?? "") + "\n" +
    "Tags: " + (tags_str ?? "") + "\n" +
    "School: " + (school ?? "") + "\n" +
    "Qualifications: " + (qualifications ?? "") + "\n" +
    "Birth Date: " + (birthDate?.toDateString() ?? "") + "\n");

  const texts = summaryDocs.map((i) => i.pageContent);
  const embeddings = await Promise.all(texts.map( (i) => generateEmbeddings(i)));
  console.log("Generated: " + embeddings.length + " For " + name);
  await setProfessorSummaryEmbeddings({
    embeddings: embeddings,
    id: prof.id,
  });

  return prof.id;
}

export async function removeProfessorSummaryEmbeddings(
  {id , userId} : {id : string , userId: string}
) : Promise<number> {
  const prof = await db.professor.findUnique({
    where: {
      id: id,
    }
  })

  if (!prof) return 404;
  if (prof.userId != userId) return 401;

  const pineconeNS = ProfReviewIndex;
  //search for old embeddings
  const old = await db.embeddingVector.findMany({
    where: {
      professorId: id,
    }
  });

  //remove from pinecone
  await Promise.all(old.map((i) => pineconeNS.deleteOne(i.PineCodeId)));
  //remove from prisma
  await Promise.all(old.map((i) => db.embeddingVector.delete({
    where: {
      id: i.id,
    }
  })));

  return 200;
}

export async function setProfessorSummaryEmbeddings(
  {
    id,
    embeddings
  } : {
    id: string;
    embeddings: any[]
  }
) {
  const pineconeNS = ProfReviewIndex;
  const vectors = embeddings.map((embedding, i) => ({
    id: `${Date.now()}-${i}-${uuid()}`,
    values: embedding,
    metadata: {
      "id": id,
    }
  }));
  console.log(`inserting ${vectors.length} vectors to pinecone under_id : ${id}`)
  await pineconeNS.upsert(vectors);

  console.log(`inserting vectors links to prisma under_id : ${id}`)
  await Promise.all(vectors.map((embedding, i) => (
    db.embeddingVector.create({
      data: {
        professorId: id,
        PineCodeId: embedding.id
      }
    })
  )));
}

export async function queryPinecone(text: string , topK: number = 10 , maxOut: number = 3 , threshold: number = 0.01) : Promise<ProfessorWithReviewsWithUsers[]> {
  const Embeddings = await generateEmbeddings(text);
  console.log(`queryPinecone: ${Embeddings.length}`);

  const res = await ProfReviewIndex.query({
    topK: topK,
    vector: Embeddings,
    includeMetadata: true,
    includeValues: false,
  });

  let out: ProfessorWithReviewsWithUsers[] = [];
  let mSet = new Set<string>();
  res.matches.forEach((i) => {

    const profID = i.metadata?.id;
    console.log(`ProfID: ${profID}`);
    if (!i.score || i.score < threshold || mSet.size >= maxOut) {
      console.log("skipped due to low score: " + i.score);
      return;
    }
    if (profID) {
      mSet.add(profID as string);
      console.log(`Added: ${mSet.size}`);
    }
  });

  for (const id of Array.from(mSet)) {
    const prof = await db.professor.findUnique({
      where: {
        id: id,
      },
      include: {
        Reviews: {
          include: {
            user: true,
          }
        }
      }
    });


    if (!prof) {
      console.log(`Warn: somehow professor with id: ${id} doesn't exist in the database`);
      continue;
    }

    out.push(prof);
  }

  console.log(`Found ${out.length} Profs matching the query`);
  return out;
}