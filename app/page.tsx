"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/protected/todo");
    }
  }, [router]);

  const advantages = [
    "Organize your tasks efficiently.",
    "Stay productive with reminders.",
    "Access your tasks anytime, anywhere.",
    "Collaborate with others easily.",
    "Track your progress effortlessly.",
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-gray-900"
      style={{
        backgroundImage:
          'url("https://i.pinimg.com/originals/ac/54/a1/ac54a128942c750799c2c1fe144d2467.jpg")',
      }}
    >
      <div className="flex flex-wrap justify-center space-y-6 md:space-y-0 md:space-x-8 p-8 bg-white/80 rounded-lg shadow-2xl">
        {/* Sign In Card */}
        <div className="w-80 p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg text-center transition-transform hover:scale-105">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          <p className="text-white/90 mb-6">Already have an account? Sign in to manage your tasks.</p>
          <Link href="/auth/signin">
            <span
              className="inline-block bg-white text-blue-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition"
              role="button"
              aria-label="Navigate to Sign In page"
            >
              Sign In
            </span>
          </Link>
        </div>

        {/* Sign Up Card */}
        <div className="w-80 p-8 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-lg text-center transition-transform hover:scale-105">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <p className="text-white/90 mb-6">New here? Create an account to start managing your tasks.</p>
          <Link href="/auth/signup">
            <span
              className="inline-block bg-white text-green-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition"
              role="button"
              aria-label="Navigate to Sign Up page"
            >
              Sign Up
            </span>
          </Link>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="mt-10 p-8 bg-white/90 rounded-lg shadow-lg w-full max-w-3xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Why Use Our To-Do App?</h3>
        <ul className="text-gray-700 list-disc list-inside space-y-2">
          {advantages.map((advantage, index) => (
            <li key={index}>{advantage}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
