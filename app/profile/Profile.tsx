"use client";
import { useState, useEffect } from "react";
import Avatar from "@/components/Avatar";
import { API_URL } from "@/lib/constants";

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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${user_id}`, {
          method: "GET",
          headers: { Authorization: token },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        setProfileData({
          first_name: data.first_name,
          last_name: data.last_name,
          avatar_url: data.avatar_url,
        });
      } catch (error: any) {
        // Adjust type if using TypeScript
        setError(error.message || "Error fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main>
      <section>
        <h1>Profile</h1>
        {profileData?.avatar_url && (
          <div>
            <Avatar avatarUrl={profileData.avatar_url} />
          </div>
        )}
        <p>
          <strong>First Name:</strong> {profileData?.first_name}
        </p>
        <p>
          <strong>Last Name:</strong> {profileData?.last_name}
        </p>
      </section>
    </main>
  );
}
