import Image from "next/image";

export default function Avatar({ avatarUrl }: { avatarUrl: string }) {
  return (
    <Image
      src={avatarUrl || "/images/default-avatar.png"}
      width={300}
      height={300}
      alt="User's profile picture"
      onError={(e) => {
        e.currentTarget.src = "/images/default-avatar.png";
      }}
    ></Image>
  );
}
