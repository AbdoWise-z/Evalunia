import { Message } from "@prisma/client";
import {ai} from "@/lib/gemini";
import {Content} from "@google/generative-ai";

const system_instruction = `

`

export const getAIResponseTo = async (
  {
    history
  } : {
    history: Message[],
  }
) =>  {

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
    // systemInstruction: system_instruction,
  });

  return res.response.text();
}
