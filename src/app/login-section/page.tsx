"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context";
import { firebaseAuth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import showLogo from "../icons/show.png";
import hideLogo from "../icons/hide.png";

const LoginPage = () => {
  const auth = firebaseAuth;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUserContext();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const handleLogin = async () => {
    try {
      userContext.setMessageArr([]);
      if (email === "" || password === "") {
        setWarning("Fill all fields");
        return;
      }
      setIsLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      setWarning("");
      setEmail("");
      setPassword("");
      router.push("chatbot-section");
    } catch (error) {
      setIsLoading(false);
      setWarning("Invalid input");
      console.log("An error occured while logging in:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mt-10 w-96 rounded bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Login
        </h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 p-2  focus:border-blue-500"
              type="text"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex gap-1">
            <div>
              <label className="mb-2 text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 p-2  focus:border-blue-500"
                type={isPasswordShown ? "text" : "password"}
                placeholder="Enter your password"
              />
            </div>
            {isPasswordShown && (
              <Image
                src={showLogo.src}
                onClick={() => setIsPasswordShown(!isPasswordShown)}
                width="20"
                height="25"
                alt="Show password"
                className="mt-8 max-h-7 max-w-7 hover:scale-110"
              ></Image>
            )}
            {!isPasswordShown && (
              <Image
                src={hideLogo.src}
                onClick={() => setIsPasswordShown(!isPasswordShown)}
                width="20"
                height="25"
                alt="Hide password"
                className="mt-8 max-h-7 max-w-7 hover:scale-110"
              ></Image>
            )}
          </div>
          <div className="font-bold text-red-600">{warning}</div>
          <button
            className=" focus:shadow-outline-blue w-full rounded bg-blue-500 p-2 text-center text-white hover:bg-blue-600 focus:outline-none"
            onClick={async () => await handleLogin()}
          >
            {!isLoading && <div>Login</div>}
            {isLoading && <ClipLoader color="white" size={20}></ClipLoader>}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-600">No account?</span>
          <Link
            href="/signup-section"
            className="ml-1 text-blue-500 hover:text-blue-600"
          >
            Sign up
          </Link>
        </div>
        <Link href="/">
          <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
