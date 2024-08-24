"use client";

import Link from "next/link";
import MainHeader from "@/components/MainHeader";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";
import { useState } from "react";
import { mirage } from "ldrs";

mirage.register();

type UserEmail = string;

type RegisterResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export default function ForgotPasswordPage() {
  const [userEmail, setUserEmail] = useState("");

  const { mutate, isPending, isError, isSuccess, error } = useMutation<
    RegisterResponse,
    Error,
    UserEmail
  >({
    mutationFn: async (userEmail: UserEmail) => {
      const response = await fetch(`${API_URL}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email: userEmail.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Your email does'nt seem to match any account.");
      }

      console.log(response);
      return response.json();
    },
    onSuccess: () => {
      setUserEmail("");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail)) {
      return;
    }

    mutate(userEmail);
  };

  return (
    <main className="grid grid-cols-1 grid-rows-[8%_1fr]  min-h-screen bg-gray-100 text-gray-700">
      <MainHeader />

      <section className="w-full flex items-center justify-center p-8 bg-gray-300">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full md:w-3/4 lg:w-1/3 bg-gray-100 p-6 rounded-lg"
        >
          <h1 className="text-center text-md md:text-left md:text-2xl font-bold text-gray-700 border-b-2 border-gray-500 pb-4">
            Forgot your password? No Worries!
          </h1>

          <p>
            {/* char code for apostrophe */}
            Enter your email, and we&rsquo;ll send you instructions to reset
            your password.
          </p>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={handleChange}
              className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></input>
          </div>

          <div className="w-full flex justify-between font-bold">
            <Link
              href={"login"}
              className="`w-1/2 md:w-1/4 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className={`w-1/2 md:w-1/4 px-4 py-2 rounded-lg text-white ${
                isPending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? (
                <l-mirage
                  size="60"
                  speed="2.5"
                  color="rgb(37 99 235)"
                ></l-mirage>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
