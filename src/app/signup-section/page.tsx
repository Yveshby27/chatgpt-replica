"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../server-actions";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { ClipLoader } from "react-spinners";
const SignUpPage = () => {
  const auth = firebaseAuth;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async () => {
    try {
      if (email === "" || password === "" || confirmPassword === "") {
        setWarning("Fill all fields");
        return;
      }
      if (confirmPassword !== password) {
        setWarning("Password and confirm password should be identical");
        return;
      }
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      if (!firebaseAuth.currentUser?.uid) return;
      await createUser({ id: firebaseAuth.currentUser.uid, email, password });
      setWarning("");
      router.push("/login-section");
    } catch (error) {
      setIsLoading(false);
      setWarning("Invalid input");
      console.log("Error adding user:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold">SIGN UP</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 focus:border-blue-500"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 focus:border-blue-500"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 focus:border-blue-500"
            type="password"
            placeholder="Confirm your password"
          />
        </div>
        <div className="font-bold text-red-600">{warning}</div>
        <div className="flex justify-between">
          <Link href="/">
            <div className="focus:shadow-outline-blue flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
              Back
            </div>
          </Link>
          <button
            onClick={async () => await handleSignup()}
            className="text-blue-500 hover:text-blue-600"
          >
            {!isLoading && <div>Register</div>}
            {isLoading && <ClipLoader color="blue" size={20}></ClipLoader>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
