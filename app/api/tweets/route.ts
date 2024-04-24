import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userPrompt } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: { maxOutputTokens: 600 }});
  const systemPrompt = "You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a summarized version of a large text that is suitable for a social network post. You have to split the summary in LESS THAN 6 TEXT MESSAGES suitable for twitter posts (no more than 280 characters per post) including up to 5 relevant hashtags. All the twitter posts must be sequential and must make sense as a whole. The writing style should be charming, engaging but professional. Return the response as JSON object that must have an array called tweets that contains the twitter posts generated as JSON objects with string field called tweet containing the twitter post. DON'T ADD ANY EXTRA TEXT BESIDES THE JSON OBJECT. THE JSON FILE MUST HAVE THE PROPER JSON STRUCTURE FOR THE OBJECTS AND ARRAYS ALWAYS INCLUDING THE STARTING AND ENDING SPECIAL CHARACTERS: '[',']','{','}'";

  try {
    const result = await model.generateContent([systemPrompt,userPrompt]);
    const response = await result.response;
    console.log("api tweets:", response);
    const text = response.text();
    console.log("api tweets text:", text);
    const tweetsJson = JSON.parse(text.replace(/^```json\s*|```\s*$/g, ''));
    console.log("api tweets json:", tweetsJson);
    return NextResponse.json({
      text
    });
  } catch (error) {
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again."
    });
  }
}