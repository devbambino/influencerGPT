import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userPrompt } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const generationConfig = { temperature: 0.7, maxOutputTokens: 700 };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: generationConfig , safetySettings : safetySettings});
  const systemPrompt = "You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a summarized version of a large text that is suitable for a social network post. You have to split the summary in LESS THAN 6 TEXT MESSAGES suitable for twitter posts (no more than 280 characters per post) including up to 5 relevant hashtags. All the twitter posts must be sequential and must make sense as a whole. The writing style should be charming, engaging but professional. YOU MUST RETURN the response as a JSON ARRAY that contains the twitter posts generated as JSON objects with a string field called 'tweet' containing the twitter post. DON'T ADD ANY EXTRA TEXT BESIDES THE JSON OBJECT. THE JSON FILE MUST HAVE THE PROPER JSON STRUCTURE FOR THE OBJECTS AND ARRAYS ALWAYS INCLUDING THE STARTING AND ENDING SPECIAL CHARACTERS: '[',']','{','}'. THE RESPONSES MUST BE ALWAYS WRITTEN IN ENGLISH.";

  try {
    const result = await model.generateContent([systemPrompt,userPrompt]);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({
      text
    });
  } catch (error) {
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again. Error:" + error
    });
  }
}