import {GoogleGenerativeAI} from "@google/generative-ai";

declare global {
  var genAI: GoogleGenerativeAI | undefined;
}

const genAI = globalThis.genAI || new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

if (process.env.NODE_ENV != "production") globalThis.genAI = genAI;

export const ai = genAI.getGenerativeModel({ model: 'gemini-pro' });