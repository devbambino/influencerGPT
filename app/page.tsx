"use client";
import { useState, ChangeEvent, SVGProps, JSX } from "react";
import toast from "react-hot-toast";
import ClipboardPasteIcon from "./components/clipboardicon";
import LinkIcon from "./components/linkicon";
import ImageIcon from "./components/imageicon";
import Loading from "./components/loading";
import Welcome from "./components/welcome";
import SocialMediaSelector from "./components/socialmediaselector";
import InputArea from "./components/inputarea";
import ResetButton from "./components/resetbtn";
import GeneratePostButton from "./components/generatepostbtn";
import GenerateTweetsButton from "./components/generatetweetsbtn";
import GeneratedPost from "./components/generatedpost";

export default function Chat() {
  // State variables with initial values
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("");
  const [article, setArticle] = useState("");
  const [post, setPost] = useState("");
  const [tweets, setTweets] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Options for input types and social media platforms
  const types = [
    { value: "image", name: "Use an image...", Icon: ImageIcon },
    { value: "clipboard", name: "From some text...", Icon: ClipboardPasteIcon },
    { value: "link", name: "From a link...", Icon: LinkIcon },
  ];

  const medias = [
    { value: "linkedin", name: "Linkedin" },
    { value: "facebook", name: "Facebook" },
    { value: "instagram", name: "Instagram" },
  ];

  // State for selected media
  const [state, setState] = useState({
    media: "linkedin",
  });

  // Function to copy text to clipboard and display success message
  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
    toast.success("Copied to clipboard!");
  }

  // Event handlers for article, state change, and file upload 
  const handleArticle = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setArticle(value);
  };
  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const fileType = file.type;
      setMimeType(fileType); // Set MIME type in state

      if (/^image\/(jpeg|png|gif)$/.test(fileType)) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const resultBase64 = reader.result as string;
          setImageData(resultBase64.split(",")[1]); // Set base64 string in state
          setImagePreviewUrl(resultBase64); // Set image URL for preview
        };
        reader.readAsDataURL(file);
      } else {
        alert("File type not supported. Please upload an image (jpeg, png, gif).");
      }
    }
  };

  // Loading state UI
  if (isLoading) {
    return <Loading />;
  }

  // Initial UI for selecting input type
  if (!type) {
    return <Welcome types={types} onTypeSelect={setType} />;
  }

  // Main UI after input type selection
  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {/* Steps for selecting social media and providing input */}
        <div className="flex flex-col gap-2">
          {!post && (
            <div className="w-full">
              <h2 className="w-full text-2xl text-green-500 font-bold">Hello, guest!!!</h2>

              <SocialMediaSelector medias={medias} selectedMedia={state.media} onMediaChange={handleChange} />

              <InputArea type={type} article={article} onArticleChange={handleArticle} onFileChange={handleFileChange} imagePreviewUrl={imagePreviewUrl} isLoading={false} />

            </div>
          )}
          <form className="flex flex-row items-start gap-2 md:gap-4">
            {!post && (
              <GeneratePostButton article={article} onButtonClicked={async () => {
                setIsLoading(true);
                if (type == "image") {
                  const response = await fetch("api/vision", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userPrompt: article,
                      media: state.media,
                      mimeType: mimeType,
                      imageData: imageData
                    }),
                  });
                  const data = await response.json();
                  setPost(data.text);
                } else if (type == "link") {
                  const responseScraping = await fetch(article.trim());
                  const dataScraping = await responseScraping.text();
                  const response = await fetch("api/scraping", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userPrompt: dataScraping,
                      media: state.media,
                    }),
                  });
                  const data = await response.json();
                  setPost(data.text);
                } else {
                  const response = await fetch("api/post", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userPrompt: article,
                      media: state.media,
                    }),
                  });
                  const data = await response.json();
                  setPost(data.text);
                }
                setIsLoading(false);
              }} />
            )}
            {post && tweets.length == 0 && (
              <GenerateTweetsButton isLoading={isLoading} onButtonClicked={async () => {
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
                const cleanedJsonString = data.text.replace(/^```json\s*|```\s*$/g, "");
                const tweetsJson = JSON.parse(cleanedJsonString);
                tweetsJson.map((tweet: { tweet: string; }) => (
                  tweets.push(tweet.tweet)
                ));
                setTweets(tweets);
                setIsLoading(false);
              }} />
            )}
            <ResetButton post={post} tweets={tweets} isLoading={isLoading} onButtonClicked={async () => {
              window.location.reload();
            }} />
          </form>
        </div>

        {/* Post generation and display section */}
        {post && !isLoading && <GeneratedPost post={post} media={state.media} onButtonClicked={() => copyText(post)} />}

        {/* Tweet thread generation and display section */}
        {tweets.length > 0 && !isLoading && (
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <h2 className="text-xl text-green-500 font-semibold tracking-tight">Here are the tweets for a Thread:</h2>
            </div>
            {tweets.map((tweet, index) => (
              <div key={index} className="flex flex-col items-center m-2">
                <div
                  className="w-full bg-white p-3 rounded border text-black"
                >{tweet}
                </div>
                <div className="flex flex-row items-center gap-2 m-2 align-middle">
                  <span className="text-md leading-6 b-0 text-white">
                    {index == 0 ? "Click the logo to copy and send the tweet to:" : "Click the logo to copy the tweet:"}
                  </span>
                  {index == 0 ?
                    <a
                      className="hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-2 rounded disabled:opacity-50"
                      href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet)} target="_blank"
                      onClick={() => copyText(tweet)}>
                      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                      </svg>
                    </a> :
                    <a
                      className="cursor-pointer hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-2 rounded disabled:opacity-50"
                      onClick={() => copyText(tweet)}>
                      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 9v6a4 4 0 0 0 4 4h4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1v2Z" />
                        <path d="M13 3.054V7H9.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 13 3.054ZM15 3v4a2 2 0 0 1-2 2H9v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3Z" />
                      </svg>
                    </a>}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}