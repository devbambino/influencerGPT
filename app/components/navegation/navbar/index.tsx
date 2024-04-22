import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <>
            <div className="flex items-center h-[50px] px-4 border-gray-850 md:px-6 sticky top-0 bg-green-500">
                <svg
                    className="h-6 w-6 text-gray-800"
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h1 className="ml-3 text-xl text-black font-bold tracking-tighter md:text-2xl">influencerGPT App v0</h1>
            </div>
        </>
    );
};

export default Navbar;