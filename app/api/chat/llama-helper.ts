import {Message} from "@prisma/client";
import {ProfessorWithReviewsWithUsers, queryPinecone, ReviewWithUser} from "@/lib/db-helper";
import {ai} from "@/lib/together";


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
You are an academic query classifier. Your sole function is to determine whether a user's input is seeking information about professors, classes, academic materials, or educational institutions. You must output ONLY "true" or "false" based on your analysis.

Respond "true" if the query relates to any of the following:
1. Professor information (e.g., names, specialties, qualifications)
2. Class information (e.g., course names, schedules, content)
3. Academic materials (e.g., textbooks, research papers)
4. Educational institutions (e.g., schools, colleges, universities)
5. General academic inquiries (e.g., fields of study, degree programs)

Respond "false" for any query not related to these academic topics.

Consider the entire conversation context, not just the most recent message. Users may be following up on or clarifying previous academic-related questions.

Your response must be either "true" or "false" with no additional explanation or text.
`

export type TogetherMessage = {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function isAskingAboutAProf(
  {
    history,
    currentMessage,
  }: {
    history: Message[],
    currentMessage: string
  }
): Promise<boolean> {

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

  const text = getTextFromResponse(res);
  console.log(`Director Text: ${text}`);
  if (text) {
    return text.includes("true");
  }
  return false;
}

const getTextFromResponse = (res: any) => {
  if (res.choices && res.choices.length > 0) {
    if (res.choices[0].message) {
      return res.choices[0].message.content;
    } else {
      return null;
    }
  }
  return null;
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

  let formattedMessages: TogetherMessage[] = [];

  formattedMessages.push({
    role: "user",
    content: (currentMessage),
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
