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
    //stream: true,
    messages: [
      {
        role: "system",
        content:
        `You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a summarized version of a large text that is suitable for a social network post. You have to split the summary in LESS THAN 6 TEXT MESSAGES suitable for twitter posts (no more than 280 characters per post) including up to 5 relevant hashtags. All the twitter posts must be sequential and must make sense as a whole. The writing style should be charming, engaging but professional. Return the response as JSON object that must have an array called tweets that contains the twitter posts generated as JSON objects with string field called tweet containing the twitter post. DON'T ADD ANY EXTRA TEXT BESIDES THE JSON OBJECT. THE JSON FILE MUST HAVE THE PROPER JSON STRUCTURE FOR THE OBJECTS AND ARRAYS ALWAYS INCLUDING THE STARTING AND ENDING SPECIAL CHARACTERS: "[", "]", "{","}"`,
      },
      {role: "user",
      content:message.content},
    ],
  });
  console.log("api tweets:",response.choices[0].message.content);

  return new Response(JSON.stringify(response.choices[0].message.content))
}