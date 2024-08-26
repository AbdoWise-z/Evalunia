import Together from "together-ai";

declare global {
  var together: Together | undefined;
}

export const ai = globalThis.together || new Together({ apiKey: process.env.TOGETHER_API_KEY });

if (process.env.NODE_ENV != "production") globalThis.together = ai;

export const getTextFromResponse = (res: any) => {
  if (res.choices && res.choices.length > 0) {
    if (res.choices[0].message) {
      return res.choices[0].message.content;
    } else {
      return null;
    }
  }
  return null;
}

export type TogetherMessage = {
  role: "user" | "assistant" | "system";
  content: string;
}