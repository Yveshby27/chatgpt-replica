"use client";
import Link from "next/link";
import React, { useState } from "react";
import { getSpecifiedUser } from "../server-actions";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context";
import { firebaseAuth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ClipLoader } from "react-spinners";
const LoginPage = () => {
  const auth = firebaseAuth;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useUserContext();

  const handleLogin = async () => {
    try {
      userContext.setMessageArr([]);
      if (email === "" || password === "") {
        setWarning("Fill all fields");
        return;
      }
      setIsLoading(true);
      const user = await getSpecifiedUser(email);
      await signInWithEmailAndPassword(auth, email, password);
      if (user === undefined) return;

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
          <div>
            <label className="mb-2 text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-2  focus:border-blue-500"
              type="password"
              placeholder="Enter your password"
            />
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
