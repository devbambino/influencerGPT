"use client";

import { JSX, SVGProps, useState } from "react";
import { Message, useChat } from "ai/react";
import Image from 'next/image';

export default function Chat() {
  const { messages } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("");
  const [state, setState] = useState({
    article: "",
    type: ""
  });

  const types = [
    { value: "image", name: "From image" },
    { value: "clipboard", name: "From text" },
    { value: "link", name: "From link" },
  ];

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleInput = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex flex-col justify-center items-center ">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div>The magic is happening...bear with us...</div>
          </div>
        </div>
      </div>
    );
  }

  function ClipboardPasteIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z" />
        <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10" />
        <path d="m17 10 4 4-4 4" />
      </svg>
    )
  }


  function ImageIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  }


  function LinkIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    )
  }

  if (!type) {
    return (
      <div className="flex flex-col h-screen w-full">
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div className="grid gap-4 text-sm leading-loose md:text-base">
            <p>The Super APP is the one app you need for all your daily tasks.</p>
            <div className="mx-auto w-[400px] ">
              <div className="grid grid-cols-3 gap-4">
                {types.map(({ value, name }) => (
                  <div className="flex flex-col cursor-pointer rounded-lg font-semibold border border-gray-200 p-6 text-center bg-green-700 hover:bg-gray-700"
                    onClick={async () => {
                      setType(value);
                    }}>
                    {value == "image" && <ImageIcon className="h-6 w-6" />}
                    {value == "clipboard" && <ClipboardPasteIcon className="h-6 w-6" />}
                    {value == "link" && <LinkIcon className="h-6 w-6" />}
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
  }

  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <h2 className="w-full text-center text-3xl text-green-500 font-bold">influencerGPT App v0</h2>
            <p className="w-full text-center text-zinc-500 dark:text-zinc-400">
              We create social networks posts for you from whatever you shared with us.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {messages.length == 0 && (
              <div className="w-full">
                <p className="my-2 text-md leading-6 b-0">
                  Write/Paste here what you want to share and we'll generate for you an engaging version of it ready to be posted on social networks:
                </p>
                <textarea className="w-full min-h-[200px] m-2 border rounded shadow-xl text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the text here..." onChange={handleInput} />
              </div>
            )}
            <form className="flex flex-row items-start gap-2 md:gap-4">
              <button
                className="w-full md:w-auto order-2 md:order-1 m-2 bg-green-700 hover:bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                hidden={messages.length > 0}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const response = await fetch("api/social", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: { role: "user", content: state.article },
                    }),
                  });
                  const data = await response.json();
                  setIsLoading(false);
                  const chats: Message = {
                    "id": "social",
                    "role": "user",
                    "content": data
                  };
                  messages.push(chats);
                }}
              >Generate post</button>
              <button
                className="w-full md:w-auto order-1 md:order-2 m-2 bg-green-700 hover:bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                hidden={messages.length != 1}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const response = await fetch("api/tweets", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: { role: "user", content: messages[0].content },
                    }),
                  });
                  const data = await response.json();
                  const cleanedJsonString = data.replace(/^```json\s*|```\s*$/g, '');
                  const tweetsJson = JSON.parse(cleanedJsonString);
                  tweetsJson.forEach((tweet: { tweet: string; }, index: number) => {
                    const tweets: Message = {
                      "id": "tweets",
                      "role": "assistant",
                      "content": tweet.tweet
                    };
                    messages.push(tweets);
                  });
                  setIsLoading(false);
                }}>
                Generate tweets
              </button>
              <button
                className="w-full md:w-auto order-2 md:order-1 m-2 bg-green-700 hover:bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                hidden={messages.length < 2}
                disabled={isLoading}
                onClick={async () => {
                  window.location.reload();
                }}
              >Reset</button>
            </form>
          </div>
        </div>
        <div className="w-full h-screen bg-green-300"></div>

        {messages.length > 0 && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-lg text-green-500 font-semibold tracking-tight">Here's the social network post:</h2>
            </div>
            <textarea
              className="min-h-[100px] border text-black p-3 m-2 rounded"
              id="summary"
              placeholder="The post will appear here."
              value={messages[0].content}
              readOnly
            />
            <div className="flex flex-row items-start text-center gap-2 m-2">
              <p className="text-sm leading-6 b-0 text-white">
                Click the logo to copy to clipboard & open in:
              </p>
              <a
                className="hover:bg-green-700 text-white rounded disabled:opacity-50"
                href="https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true" target="_blank"
                onClick={() => copyText(messages[0].content)}>
                <Image
                  src="/images/linkedin-128.png" // Route of the image file
                  height={30} // Desired size with correct aspect ratio
                  width={30} // Desired size with correct aspect ratio
                  alt="Send text to Linkedin"
                />
              </a>
            </div>

          </div>
        )}
        {messages.length > 1 && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-lg text-green-500 font-semibold tracking-tight">Here are the tweets:</h2>
            </div>
            {messages.slice(1).map((tweet) => (
              <div className="flex flex-col items-center m-2">
                <div
                  className="w-full bg-white p-3 rounded border text-black"
                >{tweet.content}
                </div>
                <div className="flex flex-row gap-2 m-2 align-middle">
                  <span className="text-sm leading-6 text-white">
                    Click the logo to copy and send the tweet to:
                  </span>
                  <a
                    className="hover:bg-green-700 p-1 text-white rounded disabled:opacity-50"
                    href="https://twitter.com/intent/tweet?text=" target="_blank"
                    onClick={() => copyText(tweet.content)}>
                    <Image
                      src="/images/twitter-128.png" // Route of the image file
                      height={20} // Desired size with correct aspect ratio
                      width={20} // Desired size with correct aspect ratio
                      alt="Send text to Twitter/X"
                    />
                  </a>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );


}