import { Message } from "@prisma/client";
import {ai} from "@/lib/gemini";
import {Content} from "@google/generative-ai";
import {ProfessorWithReviewsWithUsers, queryPinecone, ReviewWithUser} from "@/lib/db-helper";

const system_prompt_agent = `
You are an AI assistant for a RateMyProfessor-like platform. Your role is to help students gain insights about professors based on review data. When queried about a professor:

1. Analyze the available review data for the professor.
2. Provide a summary of the professor's teaching style, course difficulty, and overall rating.
3. Highlight common praise and criticisms from student reviews.
4. Offer advice on what type of student might benefit most from this professor's teaching approach.
5. If asked, provide specific quotes from reviews (without identifying reviewers).
6. Maintain a neutral tone and present balanced information.
7. If no data is available for a professor, clearly state this and suggest alternative ways to get information.
8. If the user isn't asking about a professor, then you can answer like a normal person.

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
    history,
    currentMessage,
  }: {
    history: Message[],
    currentMessage: string
  }
): Promise<boolean> {

  let formattedMessages: Content[] = [];

  formattedMessages.push({
    role: "user",
    parts: [
      {
        text: (currentMessage),
      }
    ]
  } as Content);

  history.forEach((i , idx) => {
    formattedMessages.push({
      role: i.role == 'AI' ? "model" : "user",
      parts: [
        {
          text: (i.content + (i.contentDB ?? "")),
        }
      ],
    } as Content);
  });

  const res = await ai.generateContent({
    contents: formattedMessages.reverse(),
    systemInstruction: system_prompt_director,
  });

  const text = res.response.text();
  console.log(text.includes("true"));
  return text.includes("true");
}

export type AiResponse = {
  text: string;
  contentDB: string;
  professors: ProfessorWithReviewsWithUsers[];
}

export const getAIResponseTo = async (
  {
    history,
    currentMessage,
  }: {
    history: Message[],
    currentMessage: string
  }
): Promise<AiResponse> => {

  let PineconeData = '\n\nReturned results from DB (done automatically): \n';
  let professors: ProfessorWithReviewsWithUsers[] = [];
  if ( (await isAskingAboutAProf({
    history: history,
    currentMessage: currentMessage,
  })) ){
    const profs = await queryPinecone(currentMessage);
    profs.forEach((i: ProfessorWithReviewsWithUsers) => {
      let reviews = "";
      let tags = "";
      //fixme: this is a token burning machine ...
      i.Reviews.forEach((i: ReviewWithUser) => {
        reviews += `
    Student Name: ${i.user.name}
    Content: ${i.review}
    Prof-Rating: ${i.Rating}
        `;
      })

      i.tags.forEach((i: string) => {
        tags += ` ${i}`;
      })

      PineconeData += `
  Name: ${i.name}
  Address: ${i.address}
  Email: ${i.email ?? "not set"}
  BirthDate: ${i.birthDate?.toISOString() ?? "not set"}
  Phone: ${i.phone ?? "not set"}
  Qualifications: ${i.qualifications ?? "not set"}
  Tags:${tags.length == 0 ? " none" : tags}
  School: ${i.school ?? "not set"}
  Summary: ${i.summary ?? "not set"}
  Students Reviews: ${reviews.length == 0 ? "none" : reviews}
  
  `;

      professors.push(i);
    })
  } else {
    PineconeData += 'User is not requesting info about a professor, Answer like a normal person.';
  }

  console.log(PineconeData);

  let formattedMessages: Content[] = [];

  formattedMessages.push({
    role: "user",
    parts: [
      {
        text: (currentMessage + PineconeData),
      }
    ]
  } as Content);

  history.forEach((i , idx) => {
    formattedMessages.push({
      role: i.role == 'AI' ? "model" : "user",
      parts: [
        {
          text: (i.content + (i.contentDB ?? "")),
        }
      ],
    } as Content);
  });

  const res = await ai.generateContent({
    contents: formattedMessages.reverse(),
    systemInstruction: system_prompt_agent,
  });

  return {
    text: res.response.text(),
    professors: professors,
    contentDB: PineconeData,
  };
}
