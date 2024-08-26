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
  const [invalidEmailFormat, setInvalidEmailFormat] = useState(false);

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
        throw new Error(
          "We couldn't find an account associated with that email address. Please check the email and try again."
        );
      }

      return response.json();
    },
    onSuccess: () => {
      setInvalidEmailFormat(false);
    },
    onError: (error: Error) => {
      setInvalidEmailFormat(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  //Indicated two types to allow form submition and onClick for resend email click event.
  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail)) {
      setInvalidEmailFormat(true);
      return;
    }

    mutate(userEmail);
  };

  return (
    <main className="grid grid-cols-1 grid-rows-[8%_1fr]  min-h-screen bg-gray-100 text-gray-700">
      <MainHeader />

      <section className="w-full flex items-center justify-center p-8 bg-gray-300">
        {!isSuccess && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-full md:w-1/2 lg:w-1/3 bg-gray-100 p-6 rounded-lg"
          >
            <h1 className="text-center text-md md:text-left md:text-2xl font-bold text-gray-700 border-b-2 border-gray-500 pb-4">
              Forgot your password? No Worries!
            </h1>

            <p>
              {/* char code for apostrophe */}
              Enter your email, and we&rsquo;ll send you instructions to reset
              your password.
            </p>

            {/* displays when the user submits blank input or non-email format */}
            {invalidEmailFormat && (
              <div className="text-red-500">
                Please enter a valid email address.
              </div>
            )}

            {/* displays on error return from mutaion function */}
            {isError && (
              <div className="text-red-500">
                {error?.message || "An error occurred. Please try again."}
              </div>
            )}

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
        )}
        {isSuccess && (
          <div className="flex flex-col items-center gap-3 w-full md:w-1/2 lg:w-1/3 text-center bg-gray-100 p-6 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              className="w-24"
            >
              <path
                fill="#20d958"
                d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0l57.4-43c23.9-59.8 79.7-103.3 146.3-109.8l13.9-10.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176 0 384c0 35.3 28.7 64 64 64l296.2 0C335.1 417.6 320 378.5 320 336c0-5.6 .3-11.1 .8-16.6l-26.4 19.8zM640 336a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-76.7-43.3c6.2 6.2 6.2 16.4 0 22.6l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L480 353.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0z"
              />
            </svg>
            <div className="text-lg font-bold">
              Password Reset Instructions Sent
            </div>
            <p className="py-4 border-t-2 border-gray-700">
              An email has been sent to
              <span className="text-green-500 font-bold pl-1">{userEmail}</span>
              . Please check your inbox and follow the link provided to complete
              the process.
            </p>
            <p className="pt-4 border-t-2 border-gray-700 text-sm">
              If you did not receive the email, you can
              <span
                onClick={handleSubmit}
                className="text-blue-600 cursor-pointer hover:border-b-2 hover:border-blue-700 pl-1"
              >
                resend the reset instructions.
              </span>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
