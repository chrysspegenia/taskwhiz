"use server";
import { API_URL } from "@/lib/constants";
import { cookies } from "next/headers";

type LoginState = {
  data?: {
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
  authorization?: string;
  errors?: {
    email?: string;
    password?: string;
    credentials?: string;
  };
};

export async function loginUserAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";

  const errors: { email?: string; password?: string } = {};

  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";

  if (Object.keys(errors).length > 0) return { errors };

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: { email, password },
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Login failed.");
    }

    const data = await response.json();
    const authorization = response.headers.get("Authorization") || undefined;

    if (authorization) {
      cookies().set("token", authorization, { httpOnly: true, secure: true });
    }

    cookies().set("user_id", data.user.id, { httpOnly: true, secure: true });
    cookies().set("email", data.user.email, { httpOnly: true, secure: true });
    cookies().set("first_name", data.user.first_name, {
      httpOnly: true,
      secure: true,
    });
    cookies().set("last_name", data.user.last_name, {
      httpOnly: true,
      secure: true,
    });

    const allCookies = cookies().getAll();
    allCookies.forEach((cookie) => {
      console.log(`${cookie.name}: ${cookie.value}`);
    });

    return { data, authorization };
  } catch (error: unknown) {
    return {
      errors: {
        credentials: "Incorrect email or password. Please try again.",
      },
    };
  }
}
