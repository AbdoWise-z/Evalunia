import {Message} from "@prisma/client";
import {ProfessorWithReviewsWithUsers, queryPinecone, ReviewWithUser} from "@/lib/db-helper";
import {ai, getTextFromResponse, TogetherMessage} from "@/lib/together";


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

Respond to queries concisely but informatively. 
DO NOT invent information if it's not in the review data. 
Prioritize helping students make informed decisions about their education.
`

const system_prompt_director = `
You are an AI assistant designed to analyze user queries and determine if they are seeking information about persons, academic institutions, or classes. Your task is to:

1. Carefully examine the user's input and consider any context from previous messages.
2. Determine if the query is related to finding information about:
   a) Specific persons or people in general
   b) Academic institutions
   c) Classes or courses
3. If the query matches these criteria, provide a concise summary of what the user is trying to find.
4. If the query does not match these criteria, output only the word "false".

Rules:
- Focus on queries about people (specific or general), academic institutions, and classes/courses.
- Consider the current context of the conversation when generating the summary.
- Provide a brief, clear summary starting with "trying to find information about".
- Do not answer the user's query or provide any actual information.
- If the query doesn't relate to people, academic institutions, or classes, output only "false".

Examples:
User: "Is there any physics professor in Cairo University?"
Output: trying to find information about physics professors at Cairo University

User: "What's the weather like today?"
Output: false

User: "Hello"
Output: false

User: "Who was the first female dean of Harvard Law School?"
Output: trying to find information about the first female dean of Harvard Law School

User: "Can you list all the departments in Oxford University?"
Output: trying to find information about departments in Oxford University

User: "Are there any online machine learning courses available?"
Output: trying to find information about online machine learning courses

User: "What prerequisites are needed for the advanced calculus class?"
Output: trying to find information about prerequisites for the advanced calculus class

Always analyze the query carefully and provide the appropriate output based on these guidelines.
`

export async function directorCall(
  {
    history,
    currentMessage,
  }: {
    history: Message[],
    currentMessage: string
  }
): Promise<string | null> {

  let formattedMessages: TogetherMessage[] = [];

  formattedMessages.push({
    role: "user",
    content: (currentMessage),
  } as TogetherMessage);

  formattedMessages.push({
    role: "system",
    content: system_prompt_director,
  })

  history.forEach((i , idx) => {
    formattedMessages.push({
      role: i.role == 'AI' ? "assistant" : "user",
      content: (i.content + (i.contentDB ?? "")),
    } as TogetherMessage);
  });

  const res = await ai.chat.completions.create({
    messages: formattedMessages.reverse(),
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ["<|eot_id|>","<|eom_id|>"],
    stream: false
  });

  const text = getTextFromResponse(res) as string;
  console.log(`Director Text: ${text}`);
  if (text) {
    if (text.includes("false")) {
      return null;
    }
  }
  return text;
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

  let PineconeData = '\n\nReview data returned from DB (done automatically): \n';
  let professors: ProfessorWithReviewsWithUsers[] = [];

  const summary = await directorCall({
    history: history,
    currentMessage: currentMessage,
  });

    if ( summary ){
    const profs = await queryPinecone(summary);
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

  let formattedMessages: TogetherMessage[] = [];

  formattedMessages.push({
    role: "user",
    content: (currentMessage + PineconeData),
  } as TogetherMessage);

  history.forEach((i , idx) => {
    formattedMessages.push({
      role: i.role == 'AI' ? "assistant" : "user",
      content: (i.content + (i.contentDB ?? "")),
    } as TogetherMessage);
  });

  formattedMessages.push({
    role: "system",
    content: system_prompt_agent,
  })

  const res = await ai.chat.completions.create({
    messages: formattedMessages.reverse(),
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ["<|eot_id|>","<|eom_id|>"],
    stream: false
  });

  const text = getTextFromResponse(res);
  if (!text) {
    throw "Failed to generate AI content";
  }

  return {
    text: text,
    professors: professors,
    contentDB: PineconeData,
  };
}
