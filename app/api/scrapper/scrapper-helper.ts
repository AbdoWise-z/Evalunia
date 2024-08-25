import {Professor} from "@prisma/client";
import {ai, getTextFromResponse, TogetherMessage} from "@/lib/together";
import {extractTextFromHtml} from "@/app/api/scrapper/html-helper";


const system_prompt = `
You are an AI assistant specialized in extracting structured information from HTML content. Your task is to analyze the provided HTML and extract information that matches the following schema:

Professor {
  name: String (required)
  email: String (optional)
  imageUrl: String (optional) - a personal image link of the professor
  address: String (optional)
  phone: String (optional)
  tags: String[] (optional)
  school: String (optional)
  birthDate: DateTime (optional)
  qualifications: String (optional)
  summary: String (required) - a summary about the professor's personality, life, etc.
}

Instructions:
1. Carefully examine the HTML content provided.
2. Extract any information that corresponds to the fields in the Professor schema.
3. For the 'tags' field, look for keywords or categories that describe the professor's expertise or areas of interest.
4. If a field is not found in the HTML, leave it blank or null.
5. Ensure the 'name' and 'summary' fields are always populated if the information is available.
6. Format dates in ISO 8601 format (YYYY-MM-DD) for the 'birthDate' field.
7. If an image URL is found, include the full URL path in the 'imageUrl' field.
8. Present the extracted information in a structured JSON format that matches the Professor schema.
9. If you cannot find enough information to confidently identify a professor profile, state that the HTML does not contain sufficient information for a professor profile.

Your response should only contain the extracted JSON object (without \`\`\') or the statement about insufficient information. Do not include any additional explanation or commentary.
Make sure that the JSON object is a valid one. if a value is empty, set it to null
`

export async function readHtml(code: string) : Promise<any> {
  let formattedMessages: TogetherMessage[] = [
    {
      role: "system",
      content: system_prompt,
    },
    {
      role: "user",
      content: code.length == 0 ? "<html> page loading failed  </html>" : code,
    }
  ];

  const res = await ai.chat.completions.create({
    messages: formattedMessages,
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    max_tokens: 1024,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ["<|eot_id|>","<|eom_id|>"],
    stream: false
  });

  const result = getTextFromResponse(res);
  const json = result.replace(/^```|```$/g, '');
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
}

export async function Scrap(url: string) : Promise<Professor | null> {
  try {
    // Replace this URL with your actual Cloudflare Worker URL
    const workerURL = 'https://html-scraper.zekee981.workers.dev/';
    console.log("starting: " + url);
    const response = await fetch(workerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    });

    if (!response.ok) {
      return null;
    }

    const htmlContent = await response.text();
    const data = await readHtml(extractTextFromHtml(htmlContent));
    console.log(JSON.stringify(data));
    if (data) {
      return {
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        address: data.address,
        phone: data.phone,
        tags: data.tags,
        school: data.school,
        birthDate: data.birthDate,
        qualifications: data.qualifications,
        summary: data.summary,
        //I think I could have just cast it but anyway.
      } as Professor;
    }

  } catch (error) {
    console.error('Error scraping HTML:', error);
    return null;
  }
  return null;
}