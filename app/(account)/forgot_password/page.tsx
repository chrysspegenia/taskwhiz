import Link from "next/link";
import MainHeader from "@/components/MainHeader";

export default function ForgotPasswordPage() {
  return (
    <main className="grid grid-cols-1 grid-rows-[8%_1fr]  min-h-screen bg-gray-100 text-gray-700">
      <MainHeader />

      <section className="w-full flex items-center justify-center p-8 bg-gray-300">
        <form
          action={""}
          className="flex flex-col gap-3 w-full md:w-3/4 lg:w-1/3 bg-gray-100 p-6 rounded-lg"
        >
          <h1 className="text-center text-md md:text-left md:text-2xl font-bold text-gray-700 border-b-2 border-gray-500 pb-4">
            Forgot your password? No Worries!
          </h1>

          <p>
            Enter your email, and we'll send you instructions to reset your
            password.
          </p>

          <div>
            <input
              name="email"
              type="text"
              placeholder="Email"
              className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></input>
          </div>

          <div className="w-full flex justify-between font-bold">
            <Link
              href={"login"}
              className="`w-1/2 md:w-1/4 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              // disabled={}
              className={`w-1/2 md:w-1/4 px-4 py-2 rounded-lg text-white ${
                "" ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
