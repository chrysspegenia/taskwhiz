import { cookies } from "next/headers";
import Profile from "./Profile";

export default function EditPage() {
  const token = cookies().get("token")?.value || "";
  const user_id = cookies().get("user_id")?.value || "";

  return <Profile token={token} user_id={user_id} />;
}
