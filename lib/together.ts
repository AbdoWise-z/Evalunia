import Together from "together-ai";

declare global {
  var together: Together | undefined;
}

export const ai = globalThis.together || new Together({ apiKey: process.env.TOGETHER_API_KEY });

if (process.env.NODE_ENV != "production") globalThis.together = ai;