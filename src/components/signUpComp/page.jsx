"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function SignUpComp() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [confirmPopUp, setConfirmPopup] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const supabase = createClientComponentClient();
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    getSession();
  }, [router]);

  async function SignUpNewUser(e) {
    e.preventDefault();
    const { data: user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          first_name: name,
          last_name: surname,
        },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setConfirmPopup(true);
    }
  }
  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center min-h-screen">
      <div className="w-full flex flex-col h-full items-center justify-center px-4 md:px-12 lg:px-24 gap-16">
        <div className="w-full lg:text-left text-center">
          <h1 className="text-4xl font-medium text-[#202020]">
            Create an account
          </h1>
          <p className="text-xl font-light text-[#3C4049]">
            Get started now by creating a new account.
          </p>
        </div>
        {error && (
          <div className="bg-red-600 text-white w-full text-center p-4 rounded-xl">
            Error: {error}
          </div>
        )}
        {!error && confirmPopUp ? (
          <div className="bg-green-600 text-white w-full text-left py-12 px-6 md:px-16 rounded-xl flex flex-col gap-6">
            <h3 className="text-4xl font-bold">
              Account created successfully!
            </h3>
            <h4 className="text-2xl">Thanks for joining Company</h4>
            <span>
              To finish signing up, please confirm your email address. This
              ensures we have the right email in case we need to contact you.
            </span>
          </div>
        ) : (
          <>
            <form
              onSubmit={SignUpNewUser}
              className="w-full flex flex-col gap-6"
            >
              {/* First name last name */}
              <div className="flex flex-col gap-6 md:flex-row md:gap-2 w-full">
                <div className="flex flex-col w-full">
                  <label htmlFor="firstName">
                    First name <span className="text-[#C21515]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="border border-slate-200 p-4 rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="lastName">
                    Last name <span className="text-[#C21515]">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Enter your surname"
                    className="border border-slate-200 p-4 rounded-lg"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="flex flex-col w-full">
                <label htmlFor="email">
                  Email <span className="text-[#C21515]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border border-slate-200 p-4 rounded-lg"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col w-full">
                <label htmlFor="password">
                  Password <span className="text-[#C21515]">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border border-slate-200 p-4 rounded-lg"
                />
              </div>
              {/* Checkbox */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="tos" className="mt-1" required />
                <label htmlFor="tos">
                  By creating an account, I agree to Company{" "}
                  <Link href="#" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline">
                    Privacy Policy
                  </Link>
                  . <span className="text-[#C21515]">*</span>
                </label>
              </div>
              <button className="bg-[#202020] rounded-full text-lg font-medium text-white w-full p-4 hover:opacity-90 transition">
                Create account
              </button>
            </form>
          </>
        )}
        {/* Already have an account - Login */}
        <p className="font-light text-[#202020] ">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpComp;
