"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

const SIGNUP_MUTATION = gql`
  mutation ($name: String!, $email: String!, $password: String!) {
    signUpUser(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

export default function Signup() {
  const router = useRouter();

  const [signUpUser, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect to the protected route
      router.push("/protected/todo");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents page reload
    const formData = new FormData(event.currentTarget);

    try {
      // Call the mutation
      const response = await signUpUser({
        variables: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
      });

      if (response.data?.signUpUser?.token) {
        console.log("Signup Success:", response.data);

        // Store the token in localStorage
        const token = response.data.signUpUser.token;
        localStorage.setItem("token", token);

        // Redirect to the protected route
        router.push("/protected/todo");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
      <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
        <div className="max-md:order-1 flex flex-col justify-center md:space-y-16 space-y-8 max-md:mt-16 min-h-full bg-gradient-to-r from-gray-900 to-gray-700 lg:px-8 px-4 py-4">
          <div>
            <h4 className="text-white text-lg">Create Your Account</h4>
            <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
              Welcome to our registration page! Get started by creating your account.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg">Simple & Secure Registration</h4>
            <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
              Our registration process is designed to be straightforward and secure. We prioritize your privacy and data security.
            </p>
          </div>
        </div>
        <form
          className="md:col-span-2 w-full py-6 px-6 sm:px-16 max-md:max-w-xl mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <h3 className="text-gray-800 text-xl font-bold">Create an account</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-gray-600 text-sm mb-2 block">Name</label>
              <input
                name="name"
                type="text"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Email Id</label>
              <input
                name="email"
                type="email"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                required
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-2.5 px-4 tracking-wider text-sm rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-6 text-center">
            Already have an account?
            <Link href="/auth/signin" className="text-blue-600 font-semibold hover:underline ml-1">
              Login here
            </Link>
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
        </form>
      </div>
    </div>
  );
}
