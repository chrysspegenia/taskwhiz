"use client";
import MainHeader from "@/components/MainHeader";
import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { mirage } from "ldrs";

mirage.register();

type UserPasswordParams = {
  password: string;
  password_confirmation: string;
};

type RegisterResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get("reset_password_token");

  const [formValues, setFormValues] = useState({
    password: "",
    password_confirmation: "",
  });

  const [passwordReqs, setPasswordReqs] = useState({
    hasEightChars: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  const { mutate, isPending, isSuccess } = useMutation<
    RegisterResponse,
    Error,
    UserPasswordParams
  >({
    mutationFn: async (formValues: UserPasswordParams) => {
      const response = await fetch(`${API_URL}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            reset_password_token: resetPasswordToken,
            password: formValues.password,
            password_confirmation: formValues.password_confirmation,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Your session has expired. Please request a new password reset link."
        );
      }

      return result;
    },
    onSuccess: () => {
      setFormValues({
        password: "",
        password_confirmation: "",
      });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordValidity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;

    const updatedReqs = {
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

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(formValues.password)) {
        setErrorMessage("Password does not meet the security requirements.");
        return;
      }

      if (formValues.password_confirmation !== formValues.password) {
        setErrorMessage(
          "Passwords do not match. Please ensure both password fields are identical."
        );
        return;
      }

      mutate(formValues);
    },
    [formValues, mutate]
  );

  return (
    <main className="grid grid-cols-1 grid-rows-[8%_1fr]  min-h-screen bg-gray-100 text-gray-700">
      <MainHeader />

      <section className="w-full flex items-center justify-center p-8 bg-gray-300">
        {!isSuccess ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-full md:w-3/4 lg:w-1/3 bg-gray-100 p-6 rounded-lg"
          >
            <h1 className="text-center text-md md:text-left md:text-2xl font-bold text-gray-700 border-b-2 border-gray-500 pb-4">
              Reset Your Password
            </h1>

            <p>
              Always keep your password private and never share it with anyone.
            </p>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            <div>
              <label htmlFor="password" className="block text-gray-600">
                New Password
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
                  allPasswordReqsMet
                    ? `border-green-500`
                    : `focus:border-red-500`
                }`}
              />

              <div className="peer-focus:mt-4 peer-focus:py-2 peer-focus:max-h-56 md:peer-focus:max-h-48 max-h-0 delay-300 transition-all ease-in overflow-hidden w-full rounded-lg bg-gray-500 px-4 text-sm">
                <strong>Password requirements:</strong>
                <p
                  className={`flex items-center justify-start pl-2 ${
                    passwordReqs.hasEightChars
                      ? `text-green-400`
                      : `text-red-400`
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
                    passwordReqs.hasUpperCase
                      ? `text-green-400`
                      : `text-red-400`
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
                    passwordReqs.hasLowerCase
                      ? `text-green-400`
                      : `text-red-400`
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
              <label
                htmlFor="password_confirmation"
                className="block text-gray-600"
              >
                Confirm New Password
              </label>
              <input
                name="password_confirmation"
                type="password"
                required
                onChange={(e) => {
                  handleChange(e);
                  handleMatchPasswordCheck(e);
                }}
                value={formValues.password_confirmation}
                className={`peer text-gray-700 w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                  isPasswordMatch ? `border-green-500` : `focus:border-red-500`
                }`}
              />
              <div className="peer-focus:mt-4 peer-focus:py-2 peer-focus:max-h-56 md:peer-focus:max-h-48 max-h-0 delay-300 transition-all ease-in overflow-hidden w-full rounded-lg bg-gray-500 px-4 text-sm">
                {!isPasswordMatch ? (
                  <span className="text-red-400">
                    <i className="bx bxs-x-circle pr-1"></i>Passwords do not
                    match
                  </span>
                ) : (
                  <span className="text-green-400">
                    <i className="bx bxs-check-circle pr-1"></i>Matching
                    Passwords
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className={`w-full px-4 py-2 rounded-lg text-white font-bold ${
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
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full md:w-1/2 lg:w-1/3 text-center bg-gray-100 p-6 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-24"
            >
              <path
                fill="#63E6BE"
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
              />
            </svg>
            <h1 className="font-bold text-2xl">Success!</h1>
            <p className="font-bold text-xl">
              Your password has been securely updated.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
