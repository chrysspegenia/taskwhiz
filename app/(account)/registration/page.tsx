"use client";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { mirage } from "ldrs";

mirage.register();

type NewUser = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
};

type RegisterResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export default function RegistrationPage() {
  const [formValues, setFormValues] = useState<NewUser>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [passwordReqs, setPasswordReqs] = useState({
    password: "",
    hasEightChars: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const { mutate, isPending, isError, isSuccess, error } = useMutation<
    RegisterResponse,
    Error,
    NewUser
  >({
    mutationFn: async (newUser: NewUser) => {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email: newUser.email.trim(),
            first_name: newUser.first_name.trim(),
            last_name: newUser.last_name.trim(),
            password: newUser.password,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Please check your details and try again.");
      }

      return response.json();
    },
    onSuccess: () => {
      // Clear form values on successful registration
      setFormValues({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
      });

      // Reset password requirements and password match state
      setPasswordReqs({
        password: "",
        hasEightChars: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
      setIsPasswordMatch(false);
    },
  });

  const handlePasswordValidity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;

    const updatedReqs = {
      password: password,
      hasEightChars: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordReqs(updatedReqs);
  };

  const allPasswordReqsMet = Object.values(passwordReqs).every(Boolean);

  const handleMatchPasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordConfirm = e.target.value;
    setIsPasswordMatch(passwordConfirm === formValues.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formValues.first_name.length < 2 ||
      formValues.last_name.length < 2 ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formValues.email
      ) ||
      formValues.password !== formValues.confirm_password
    ) {
      return;
    }

    mutate(formValues);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_35%] min-h-screen">
      <header className="absolute top-0 right-0 px-6 py-4 text-gray-700">
        <Link href="/">TaskWhiz</Link>
      </header>

      <section className="hidden md:flex items-center justify-center bg-blue-600">
        This is image placeholder
      </section>

      <section className="flex items-center justify-center p-8 bg-gray-100">
        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          {isError && (
            <p className="mt-2 text-center text-lg text-red-500">
              Registration failed. {error.message}
            </p>
          )}

          {isSuccess && (
            <p className="mt-2 text-center text-lg text-green-500">
              Account created successfully! <br></br>
              Welcome to TaskWhiz!
            </p>
          )}

          <h1 className="text-2xl font-bold text-gray-700">
            Create an account
          </h1>

          <div className="flex flex-col md:flex-row gap-6 md:gap-5">
            <span>
              <label htmlFor="first_name" className="block text-gray-600">
                First Name
              </label>
              <input
                name="first_name"
                type="text"
                required
                value={formValues.first_name}
                onChange={handleChange}
                className="valid:border-green-500 focus:invalid:border-red-500 text-gray-700 w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
              />
            </span>

            <span>
              <label htmlFor="last_name" className="block text-gray-600">
                Last Name
              </label>
              <input
                name="last_name"
                type="text"
                required
                value={formValues.last_name}
                onChange={handleChange}
                className="valid:border-green-500 focus:invalid:border-red-500 text-gray-700 w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
              />
            </span>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={formValues.email}
              onChange={handleChange}
              className="valid:border-green-500 focus:invalid:border-red-500 text-gray-700 w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              onChange={(e) => {
                handleChange(e);
                handlePasswordValidity(e);
              }}
              value={formValues.password}
              className={`peer text-gray-700 w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                allPasswordReqsMet ? `border-green-500` : `focus:border-red-500`
              }`}
            />

            <div className="peer-focus:mt-6 peer-focus:py-2 peer-focus:max-h-56 md:peer-focus:max-h-48 max-h-0 delay-300 transition-all ease-in-out overflow-hidden w-full rounded-lg bg-gray-500 px-4 text-sm">
              <strong>Password requirements:</strong>
              <p
                className={`flex items-center justify-start pl-2 ${
                  passwordReqs.hasEightChars ? `text-green-400` : `text-red-400`
                }`}
              >
                {passwordReqs.hasEightChars ? (
                  <i className="bx bxs-check-circle pr-1"></i>
                ) : (
                  <i className="bx bxs-x-circle pr-1"></i>
                )}
                Minimum 8 characters
              </p>
              <p
                className={`flex items-center justify-start pl-2 ${
                  passwordReqs.hasUpperCase ? `text-green-400` : `text-red-400`
                }`}
              >
                {passwordReqs.hasUpperCase ? (
                  <i className="bx bxs-check-circle pr-1"></i>
                ) : (
                  <i className="bx bxs-x-circle pr-1"></i>
                )}
                At least one uppercase letter
              </p>
              <p
                className={`flex items-center justify-start pl-2 ${
                  passwordReqs.hasLowerCase ? `text-green-400` : `text-red-400`
                }`}
              >
                {passwordReqs.hasLowerCase ? (
                  <i className="bx bxs-check-circle pr-1"></i>
                ) : (
                  <i className="bx bxs-x-circle pr-1"></i>
                )}{" "}
                At least one lowercase letter
              </p>
              <p
                className={`flex items-center justify-start pl-2 ${
                  passwordReqs.hasNumber ? `text-green-400` : `text-red-400`
                }`}
              >
                {passwordReqs.hasNumber ? (
                  <i className="bx bxs-check-circle pr-1"></i>
                ) : (
                  <i className="bx bxs-x-circle pr-1"></i>
                )}
                At least one number
              </p>
              <p
                className={`flex items-center justify-start pl-2 ${
                  passwordReqs.hasSpecialChar
                    ? `text-green-400`
                    : `text-red-400`
                }`}
              >
                {passwordReqs.hasSpecialChar ? (
                  <i className="bx bxs-check-circle pr-1"></i>
                ) : (
                  <i className="bx bxs-x-circle pr-1"></i>
                )}
                At least one special character (e.g., !, @, etc.)
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-gray-600">
              Confirm Password
            </label>
            <input
              name="confirm_password"
              type="password"
              required
              onChange={(e) => {
                handleChange(e);
                handleMatchPasswordCheck(e);
              }}
              value={formValues.confirm_password}
              className={`peer text-gray-700 w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                isPasswordMatch ? `border-green-500` : `focus:border-red-500`
              }`}
            />
            <div className="peer-focus:mt-6 peer-focus:py-2 peer-focus:max-h-56 md:peer-focus:max-h-48 max-h-0 delay-300 transition-all ease-in overflow-hidden w-full rounded-lg bg-gray-500 px-4 text-sm">
              {!isPasswordMatch && (
                <span className="text-red-400">
                  <i className="bx bxs-x-circle pr-1"></i>Passwords do not match
                </span>
              )}
              {isPasswordMatch && (
                <span className="text-green-400">
                  <i className="bx bxs-check-circle pr-1"></i>Matching Passwords
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full px-4 py-2 rounded-lg text-white ${
              isPending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? (
              <l-mirage size="60" speed="2.5" color="rgb(37 99 235)"></l-mirage>
            ) : (
              "Create account"
            )}
          </button>

          <Link
            href="login"
            className="block text-right text-blue-600 hover:underline text-sm"
          >
            Already have an account?
          </Link>
        </form>
      </section>
    </main>
  );
}
