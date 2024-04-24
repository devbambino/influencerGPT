"use client";

import { JSX, SVGProps, useState } from "react";
import { Message, useChat } from "ai/react";
import Image from 'next/image';

export default function Chat() {
  const { messages } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("");
  const [post, setPost] = useState("");
  const [tweets, setTweets] = useState<string[]>([]);
  const [state, setState] = useState({
    article: "",
    type: ""
  });

  const types = [
    { value: "image", name: "Use an image..." },
    { value: "clipboard", name: "From some text..." },
    { value: "link", name: "From a link..." },
  ];

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
          <div className="animate-pulse text-slate-300 flex flex-col justify-center items-center ">
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path stroke="currentColor" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z" />
            </svg>
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

  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
  }

  if (!type) {
    return (
      <div className="flex flex-col h-screen w-full">
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div className="grid gap-4">
            <h2 className="w-full text-center text-2xl text-green-500 font-bold">Welcome to influencerGPT</h2>
            <p className="w-full text-center text-xl text-zinc-500 dark:text-zinc-400">
              We create social networks posts for you from whatever you shared with us:
            </p>
            <div className="mx-auto w-[400px] mt-8">
              <div className="grid grid-cols-3 gap-4 text-green-500">
                {types.map(({ value, name }) => (
                  <div key={value} className="flex flex-col items-center justify-center cursor-pointer rounded-lg font-semibold hover:bg-green-500 hover:text-white border border-green-500 p-4 text-center "
                    onClick={async () => {
                      setType(value);
                    }}>
                    {value == "image" && <ImageIcon className="h-6 w-6 mb-2" />}
                    {value == "clipboard" && <ClipboardPasteIcon className="h-6 w-6 mb-2" />}
                    {value == "link" && <LinkIcon className="h-6 w-6 mb-2" />}
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

  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {!post && (
              <div className="w-full">
                <h2 className="w-full text-xl text-green-500 font-bold">Hello, guest!!!</h2>
                <p className="my-2 text-md leading-6 b-0">
                  Write/Paste here what you want to share and we'll generate for you an engaging version of it ready to be posted on social networks:
                </p>
                <textarea className="w-full min-h-[200px] m-2 border rounded shadow-xl text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the text here..." onChange={handleInput} />
              </div>
            )}
            <form className="flex flex-row items-start gap-2 md:gap-4">
              {!post && (
                <button
                  className="inline-flex text-center justify-center items-center w-full md:w-auto order-1 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    const response = await fetch("api/post", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userPrompt: state.article,
                      }),
                    });
                    const data = await response.json();
                    setIsLoading(false);
                    setPost(data.text);
                  }}
                >
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path stroke="currentColor" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z" />
                  </svg>
                  <span>Generate post</span>
                </button>
              )}
              {post && tweets.length == 0 && (
                <button
                  className="inline-flex items-center w-full md:w-auto order-2 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-500"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    const response = await fetch("api/tweets", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userPrompt: post,
                      }),
                    });
                    const data = await response.json();
                    const cleanedJsonString = data.text.replace(/^```json\s*|```\s*$/g, '');
                    const tweetsJson = JSON.parse(cleanedJsonString);
                    tweetsJson.forEach((tweet: { tweet: string; }, index: number) => {
                      setTweets( // Replace the state
                        [ // with a new array
                          ...tweets, // that contains all the old items
                          tweet.tweet// and one new item at the end
                        ]
                      );
                    });
                    setIsLoading(false);
                  }}>
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path fill-rule="evenodd" d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z" clip-rule="evenodd" />
                  </svg>
                  <span>Generate tweets</span>
                </button>
              )}
              {post && tweets.length > 0 && (
                <button
                  className="inline-flex items-center w-full md:w-auto order-3 m-2 font-bold hover:bg-green-500 text-green-500 hover:text-white border border-green-500 py-2 px-4 rounded disabled:opacity-50"
                  hidden={post.length == 0 || tweets.length == 0}
                  disabled={isLoading}
                  onClick={async () => {
                    window.location.reload();
                  }}
                >
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path stroke="currentColor" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                  </svg>
                  <span>Reset</span>
                </button>
              )}
            </form>
          </div>
        </div>

        {post && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-lg text-green-500 font-semibold tracking-tight">Here's the social network post:</h2>
            </div>
            <textarea
              className="min-h-[100px] border text-black p-3 m-2 rounded"
              id="summary"
              placeholder="The post will appear here."
              value={post}
              readOnly
            />
            <div className="flex flex-row items-center text-center gap-2 m-2">
              <p className="text-sm leading-6 b-0 text-white">
                Click the logo of the social network to copy to clipboard & open it:
              </p>
              <a
                className="hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-2 rounded disabled:opacity-50"
                href="https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true" target="_blank"
                onClick={() => copyText(post)}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd" />
                  <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                </svg>
              </a>
            </div>

          </div>
        )}
        {tweets.length > 0 && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-lg text-green-500 font-semibold tracking-tight">Here are the tweets:</h2>
            </div>
            {tweets.map((tweet) => (
              <div className="flex flex-col items-center m-2">
                <div
                  className="w-full bg-white p-3 rounded border text-black"
                >{tweet}
                </div>
                <div className="flex flex-row items-center gap-2 m-2 align-middle">
                  <span className="text-sm leading-6 text-white">
                    Click the logo to copy and send the tweet to:
                  </span>
                  <a
                    className="hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-2 rounded disabled:opacity-50"
                    href="https://twitter.com/intent/tweet?text=" target="_blank"
                    onClick={() => copyText(tweet)}>
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                    </svg>
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