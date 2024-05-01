interface GeneratedTweetsProps {
    tweets: string[];
    onButtonClicked: () => void;
}

export default function GeneratedTweets({ tweets, onButtonClicked }: GeneratedTweetsProps) {
    return (
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
                                onClick={onButtonClicked}>
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                </svg>
                            </a> :
                            <a
                                className="cursor-pointer hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-2 rounded disabled:opacity-50"
                                onClick={onButtonClicked}>
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 9v6a4 4 0 0 0 4 4h4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1v2Z" />
                                    <path d="M13 3.054V7H9.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 13 3.054ZM15 3v4a2 2 0 0 1-2 2H9v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3Z" />
                                </svg>
                            </a>}

                    </div>
                </div>
            ))}
        </div>
    );
}