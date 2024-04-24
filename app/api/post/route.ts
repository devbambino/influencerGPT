import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userPrompt } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: { maxOutputTokens: 600 }});
  const systemPrompt = "You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a text that you must summarize it if the text is really large or re-write it if the text is short, to make it engaging and suitable for a social network post. The summarized text MUST have less than 250 words, and you have to also include up to 7 relevant hashtags in the end of the summary. The writing style should be charming, engaging but professional. DON'T ADD ANY EXTRA TEXT BESIDES THE SUMMARY AND THE HASHTAGS. DON'T ADD ADDITIONAL NOTES OR RECOMMENDATIONS ON HOW TO USE THE SUMMARY.";

  try {
    const result = await model.generateContent([systemPrompt,userPrompt]);
    const response = await result.response;
    console.log("api post:", response);
    const text = response.text();
    return NextResponse.json({
      text
    });
  } catch (error) {
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again."
    });
  }
}