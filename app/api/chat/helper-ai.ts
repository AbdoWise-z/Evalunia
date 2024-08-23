import { Message } from "@prisma/client";
import {ai} from "@/lib/gemini";
import {Content} from "@google/generative-ai";
import {generateEmbeddings, ProfReviewIndex} from "@/lib/pinecone";

const system_prompt_agent = `
You are an AI assistant for a RateMyProfessor-like platform. Your role is to help students gain insights about professors based on review data. When queried about a professor:

1. Analyze the available review data for the professor.
2. Provide a summary of the professor's teaching style, course difficulty, and overall rating.
3. Highlight common praise and criticisms from student reviews.
4. Offer advice on what type of student might benefit most from this professor's teaching approach.
5. If asked, provide specific quotes from reviews (without identifying reviewers).
6. Maintain a neutral tone and present balanced information.
7. If no data is available for a professor, clearly state this and suggest alternative ways to get information.

Respond to queries concisely but informatively. Do not invent information if it's not in the review data. Prioritize helping students make informed decisions about their education.
`

const system_prompt_director = `
You are an AI agent that determines if a user is seeking information about a professor or teacher. Your task:

1. Analyze the input query and surrounding context carefully.
2. Determine if the query is both:
   a) About a professor or teacher (including general terms like educator, instructor, etc.)
   b) Seeking information or details about them

3. Output ONLY "true" if both conditions are met:
   - The query is about a professor/teacher
   - The user is asking for information about them

4. Output ONLY "false" for all other cases, including:
   - Queries not about educators
   - Statements about educators that don't seek information
   - General academic questions not specific to educators

Respond with nothing but "true" or "false". Consider context from previous messages if available.

Examples:
"Who is the best professor?" -> true
"Is Dr. Smith teaching next semester?" -> true
"I hate my math teacher" -> false (statement, not seeking info)
"What's the weather like?" -> false
`

async function isAskingAboutAProf(
  {
    history
  }: {
    history: Message[],
  }
): Promise<boolean> {
  const formattedMessages = history.map((i) => {
    return {
      role: i.role == 'AI' ? "model" : "user",
      parts: [
        {
          text: i.content,
        }
      ],
    } as Content
  }).reverse();

  const res = await ai.generateContent({
    contents: formattedMessages,
    systemInstruction: system_prompt_director,
  });

  const text = res.response.text();
  console.log(text.includes("true"));
  return text.includes("true");
}

export type ProfData = {
  id: string;
  name: string;
  review: string;
  score: string;
}

export type AiResponse = {
  text: string;
  professors: ProfData[];
}

export const getAIResponseTo = async (
  {
    history
  }: {
    history: Message[],
  }
): Promise<AiResponse> => {

  let PineconeData = '\n\nReturned results from DB (done automatically): \n';
  let professors: ProfData[] = [];
  if ( (await isAskingAboutAProf({
    history: history
  })) ){
    const Embeddings = await generateEmbeddings(history[0].content);
    console.log(Embeddings);

    const res = await ProfReviewIndex.namespace('review-vectors').query({
      topK: 3,
      vector: Embeddings,
      includeMetadata: true,
      includeValues: false,
    });

    console.log(res.matches.length);

    res.matches.forEach((i) => {
      PineconeData += `
      Name: ${i.metadata?.professor ?? "Undefined"}
      stars: ${i.metadata?.stars ?? "Undefined"}
      review: ${i.metadata?.review ?? "Undefined"}
      
      `;

      professors.push({
        id: `${i.id}`,
        name: `${i.metadata?.professor ?? "Undefined"}`,
        review: `${i.metadata?.review ?? "Undefined"}`,
        score: `${i.metadata?.stars ?? "Undefined"}`,
      })
    })
  } else {
    PineconeData += 'NONE';
  }

  console.log(PineconeData);

  const formattedMessages = history.map((i , idx) => {
    return {
      role: i.role == 'AI' ? "model" : "user",
      parts: [
        {
          text: idx == 0 ? (i.content + PineconeData) : i.content,
        }
      ],
    } as Content
  }).reverse();

  const res = await ai.generateContent({
    contents: formattedMessages,
    systemInstruction: system_prompt_agent,
  });

  return {
    text: res.response.text(),
    professors: professors,
  };
}
