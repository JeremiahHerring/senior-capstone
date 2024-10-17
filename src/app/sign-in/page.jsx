"use client";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [signinWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await signinWithEmailAndPassword(email, password);
      console.log("User signed up:", res.user);
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (e) {
      console.error("Error signing up:", e);
    }
  };

  const handleGithubSignin = () => {
    console.log("Signing up with GitHub");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSignin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign In
          </button>
        </form>
        <div className="flex items-center justify-between mt-4">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-2 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>
        <button
          onClick={handleGithubSignin}
          className="w-full mt-4 p-2 text-white bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-500"
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
};

export default Signup;
