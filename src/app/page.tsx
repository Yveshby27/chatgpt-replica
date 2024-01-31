'use client'
import Link from "next/link";
import { useState } from "react";
import { ClipLoader } from "react-spinners";


const Home = () => {
const [isLoginLoading,setIsLoginLoading]=useState(false)
const [isSignUpLoading,setIsSignUpLoading]=useState(false)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-8 text-center text-4xl font-bold">ChatGPT Replica</h1>
      <p className="mb-8 text-center text-lg text-gray-700">
        Your Personal AI Assistant! Experience the power of cutting-edge
        language models as we bring you a state-of-the-art conversational AI
        that understands and responds to your queries with human-like
        intelligence. Enhance your interactions, streamline productivity, and
        explore the future of personalized assistance. Start a conversation
        today and witness the next level of AI engagement!
      </p>
      <div className="flex flex-col gap-4 ">
        <Link href="/login-section">
          <div onClick={()=>setIsLoginLoading(true)} className=" text-centercursor-pointer border border-solid border-blue-600 p-5 pl-10 pr-10 text-center transition duration-300 hover:bg-blue-600 hover:text-white">
           {!isLoginLoading && <div>Login</div>}
           {isLoginLoading && <ClipLoader color="black" size={20}></ClipLoader>}
          </div>
        </Link>
        <Link href="/signup-section">
          <div onClick={()=>setIsSignUpLoading(true)} className="text-center cursor-pointer border border-solid border-blue-600 p-5 pl-10 pr-10 transition duration-300 hover:bg-blue-600 hover:text-white">
          {!isSignUpLoading && <div>Sign up</div>}
           {isSignUpLoading && <ClipLoader color="black" size={20}></ClipLoader>}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
