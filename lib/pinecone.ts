import { Pinecone } from '@pinecone-database/pinecone';

declare global {
  var pc: Pinecone | undefined;
}

export const pc = globalThis.pc || new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? "SET THE API KEY IN .ENV",
});

if (process.env.NODE_ENV != "production") globalThis.pc = pc;

export const ProfReviewIndex = pc.index('prof-review-data');

export const generateEmbeddings = async (text: string) : Promise<any> => {
  const response = await fetch("https://api-inference.huggingface.co/models/intfloat/multilingual-e5-large", {
    headers: {
      Authorization: `Bearer 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`, "Content-Type": "application/json",
    }, method: "POST", body: JSON.stringify({inputs: text}),
  });

  if (response.status === 503) {
    const respBody = await response.json();
    await new Promise(resolve => setTimeout(resolve, Math.ceil(respBody.estimated_time * 2 / 3) * 1000));
    return generateEmbeddings(text);
  } else if (response.status !== 200) {
    console.log("Error: ", response.status);
    console.log("Response: ", await response.text());
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
}


export const generateEmbeddings2 = async (text: string) : Promise<any> => {

}