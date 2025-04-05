"use client"; // Required for client-side interactivity

import {  useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HomepageContext } from "@/context";
import Header from "@components/header/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  

  // Handle login when the form is submitted
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies in the request
      });
      
      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem("accessToken", data.accessToken);
        }
        router.push("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred while logging in");
    }
  };
  interface KeyDownEvent extends React.KeyboardEvent<HTMLDivElement> {}


  return (
    <HomepageContext.Provider value={{accessToken: accessToken || ""}}>
      <div>
        <Header />
      <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg shadow-lg w-96 border-1">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-400 rounded text-gray-500 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded text-gray-500 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
          
          <button type="submit" className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
    </HomepageContext.Provider>
    
  );
}
