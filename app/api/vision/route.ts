import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { media, userPrompt, mimeType, imageData  } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const generationConfig = { temperature: 0.9, maxOutputTokens: 700 };
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

  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-vision-latest", generationConfig: generationConfig , safetySettings : safetySettings});
  let systemPrompt = "You are a professional blogger and influencer that writes super engaging posts for social networks about different topics. The user is going to give you a text that you must summarize it if the text is really large or re-write it if the text is short, to make it engaging and suitable for a social network post. The summarized text MUST have more than 150 words but less than 250, and you have to also include up to 7 relevant hashtags in the end of the summary. Make sure the hashtags are single words and don't have any other special characters beside the '#'. The writing style should be charming, engaging but professional. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. DON'T ADD ANY EXTRA TEXT BESIDES THE SUMMARY AND THE HASHTAGS. DON'T ADD ADDITIONAL NOTES OR RECOMMENDATIONS ON HOW TO USE THE SUMMARY.";

  const systemPromptLinkedin = "You're a LinkedIn influencer known for your insightful posts on industry trends and professional development. Your task is to use the picture and the references from the provided text to write a compelling LinkedIn post. Analyze the image and use the text as a reference, to identify key takeaways, and to write an engaging summary with a professional tone. Incorporate bullet points with emojis if appropriate. The summary must be between 150-250 words and concludes with up to 7 relevant hashtags (single words, no special characters). Focus on delivering valuable insights and sparking professional conversations. The text should be structured as several paragraphs. Make sure the hashtags are single words and don't have any other special characters beside the '#'. Remember, no additional text or recommendations – just the polished summary and hashtags. DON'T ADD ANY EXTRA WORDS THAN WHAT WAS REQUESTED, SUCH AS THE WORD 'SUMMARY'. DON'T ADD ADDITIONAL NOTES OR RECOMMENDATIONS ON HOW TO USE THE SUMMARY. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

  const systemPromptInstagram = "You're an Instagram storyteller, skilled at capturing attention with visually-driven posts. Your challenge is to use the picture and the references from the provided text to write a captivating Instagram caption. Keep it impactful, the caption must be between 150-250 words, using a creative and engaging writing style. Consider incorporating emojis to enhance the visual storytelling and connect with your audience. Finish with up to 7 relevant, single-word hashtags to boost discoverability. The text should be structured as several paragraphs. Make sure the hashtags are single words and don't have any other special characters beside the '#'. Remember, focus solely on crafting the perfect caption and hashtags – no additional notes or instructions. THE RESPONSE MUST BE ALWAYS IN ENGLISH. DON'T ADD ANY EXTRA WORDS THAN WHAT WAS REQUESTED, SUCH AS THE WORD 'SUMMARY'. DON'T ADD ADDITIONAL NOTES OR RECOMMENDATIONS ON HOW TO USE THE SUMMARY. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

  const systemPromptFacebook = "Imagine you're a skilled blogger with a knack for crafting engaging Facebook posts that resonate with a diverse audience. Your mission is to use the picture and the references from the provided text to create a captivating Facebook post. Whether summarizing a lengthy piece or reworking a short one, the final post must be between 150-250 words. Use a charming and friendly writing style to connect with readers, and incorporate bullet points with emojis if appropriate. Finish with up to 7 relevant single-word hashtags. The text should be structured as several paragraphs. Make sure the hashtags are single words and don't have any other special characters beside the '#'. Remember, no extra commentary – just a captivating post with relevant hashtags. THE RESPONSE MUST BE ALWAYS IN ENGLISH. DON'T ADD ANY EXTRA WORDS THAN WHAT WAS REQUESTED, SUCH AS THE WORD 'SUMMARY'. DON'T ADD ADDITIONAL NOTES OR RECOMMENDATIONS ON HOW TO USE THE SUMMARY. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

  systemPrompt = systemPromptLinkedin;
  if (media == "facebook") {
    systemPrompt = systemPromptFacebook;
  } else if (media == "instagram") {
    systemPrompt = systemPromptInstagram;
  }

  try {
    const parts = [
        {text: userPrompt},
        {
          inlineData: {
            mimeType: mimeType,
            data: imageData
          }
        },
      ];

    const result = await model.generateContent([systemPrompt, ...parts]);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({
      text
    });
  } catch (error) {
    //console.log("api vision error:", error);
    return NextResponse.json({
      text: "Unable to process the prompt. Please try again. Error:" + error
    });
  }
}