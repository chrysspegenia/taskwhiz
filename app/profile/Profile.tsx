"use client";
import Avatar from "@/components/Avatar";
import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

type ProfileData = {
  first_name: string;
  last_name: string;
  avatar_url: string;
};

export default function Profile({
  token,
  user_id,
}: {
  token: string;
  user_id: string;
}) {
  const { isPending, data, error, isError } = useQuery<ProfileData>({
    queryKey: ["userData", user_id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users/${user_id}`, {
        method: "GET",
        headers: { Authorization: token },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data.");
      }

      return response.json();
    },
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {(error as Error).message}</p>;
  }

  return (
    <main>
      <section>
        <h1>Profile</h1>
        {data?.avatar_url && (
          <div>
            <Avatar avatarUrl={data.avatar_url} />
          </div>
        )}
        <p>
          <strong>First Name:</strong> {data?.first_name}
        </p>
        <p>
          <strong>Last Name:</strong> {data?.last_name}
        </p>
      </section>
    </main>
  );
}
