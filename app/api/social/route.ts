import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content:
          `You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a text that you must summarize it if the text is really large or re-write it if the text is short, to make it engaging and suitable for a social network post. The summarized text MUST have less than 250 words, and you have to also include up to 7 relevant hashtags in the end of the summary. The writing style should be charming, engaging but professional. DON'T ADD ANY EXTRA TEXT BESIDES THE SUMMARY AND THE HASHTAGS. DON'T ADD ADDITIONAL NOTES OR RECOMMENDATIONS ON HOW TO USE THE SUMMARY.`,
      },
      {role: "user",
      content: message.content},
    ],
  });

  console.log("api social:", response.choices[0].message.content);

  return new Response(JSON.stringify(response.choices[0].message.content))
}