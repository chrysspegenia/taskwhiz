"use client";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";

type UserData = {
  first_name: string;
  last_name: string;
};

type UserAvatar = File | null;

export default function Edit({
  token,
  user_id,
}: {
  token: string;
  user_id: string;
}) {
  const [formValues, setFormValues] = useState<UserData>({
    first_name: "",
    last_name: "",
  });

  const [avatar, setAvatar] = useState<UserAvatar>(null); // Handle file separately

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: async (newUserData: {
      formValues: UserData;
      avatar: UserAvatar;
    }) => {
      const formData = new FormData();
      formData.append(
        "user[first_name]",
        newUserData.formValues.first_name.trim()
      );
      formData.append(
        "user[last_name]",
        newUserData.formValues.last_name.trim()
      );

      if (newUserData.avatar) {
        formData.append("user[avatar]", newUserData.avatar);
      }

      const response = await fetch(`${API_URL}/users/${user_id}`, {
        method: "PATCH",
        headers: { Authorization: token },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to update user data.");
      }

      console.log(response);
      return response.json();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Combine form values and file into one object
    mutate({ formValues, avatar });
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="avatar">Avatar</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label htmlFor="first_name">First name</label>
        <input
          type="text"
          name="first_name"
          value={formValues.first_name}
          onChange={handleChange}
        />

        <label htmlFor="last_name">Last name</label>
        <input
          type="text"
          name="last_name"
          value={formValues.last_name}
          onChange={handleChange}
        />

        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Submit"}
        </button>

        {isError && <p>Error: {error?.message}</p>}
        {isSuccess && <p>Profile updated successfully!</p>}
      </form>
    </main>
  );
}
