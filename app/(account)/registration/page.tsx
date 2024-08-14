import Link from "next/link";

export default function RegistrationPage() {
  return (
    <main>
      <p>This is the registration page</p>
      <Link href={"login"}>Already have an account?</Link>
    </main>
  );
}
