"use server";

type LoginState = {
  data?: {
    email: string;
    password: string;
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
    const response = await fetch(`${process.env.API_URL}/login`, {
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

    // Save data in state management or handle side effects here
    // Example: update some global state or local state with the response data

    return { data, authorization };
  } catch (error: unknown) {
    return {
      errors: {
        credentials: "Incorrect email or password. Please try again.",
      },
    };
  }
}
