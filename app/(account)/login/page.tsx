"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { loginUserAction } from "@/actions/auth-actions";
import { useDispatch } from "react-redux";
import { updateUser } from "@/state/user/userSlice";

const INITIAL_STATE = {
  email: "",
  password: "",
  credentials: "",
  errors: {},
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const [formState, formAction, pending] = useFormState(
    loginUserAction,
    INITIAL_STATE
  );

  useEffect(() => {
    if (formState.data) {
      const user = formState.data.user;
      if (user) {
        dispatch(updateUser(user));
        console.log(`from redux:`, user);
      } else {
        console.error("User data not found in formState");
      }
    }
  }, [formState.data, dispatch]);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[35%_1fr] min-h-screen">
      <header className="absolute top-0 left-0 px-6 py-4 text-gray-700">
        <Link href="/">TaskWhiz</Link>
      </header>

      <section className="flex items-center justify-center p-8 bg-gray-100">
        <form action={formAction} className="w-full max-w-sm space-y-6">
          <h1 className="text-2xl font-bold text-gray-700">Welcome Back!</h1>

          <div>
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              name="email"
              type="text"
              className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></input>
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></input>
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`w-full px-4 py-2 rounded-lg text-white ${
              pending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {pending ? "Loading..." : "Login"}
          </button>

          {formState?.errors?.email && (
            <p className="mt-2 text-sm text-red-500">
              {formState.errors.email}
            </p>
          )}

          {formState?.errors?.password && (
            <p className="mt-2 text-sm text-red-500">
              {formState.errors.password}
            </p>
          )}

          {formState?.errors?.credentials && (
            <p className="mt-2 text-center text-sm text-red-500">
              {formState.errors.credentials}
            </p>
          )}

          <Link
            href={"password_reset"}
            className="block text-center text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
          <Link
            href={"registration"}
            className="block text-center text-blue-600 hover:underline"
          >
            Create an account
          </Link>
        </form>
      </section>

      <section className="hidden md:flex items-center justify-center bg-blue-600">
        This is image placeholder
      </section>
    </main>
  );
}
