import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="flex justify-between items-center w-screen h-14 px-8">
      <Link href={"./"}>TaskWhiz</Link>
      <div className="flex gap-10">
        <Link href={"login"}>Login</Link>
        <Link href={"registration"}>Register</Link>
      </div>
    </header>
  );
}
