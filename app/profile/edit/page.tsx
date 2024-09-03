import { cookies } from "next/headers";
import Edit from "./Edit";

export default function EditPage() {
  const token = cookies().get("token")?.value || "";
  const user_id = cookies().get("user_id")?.value || "";

  return <Edit token={token} user_id={user_id} />;
}
