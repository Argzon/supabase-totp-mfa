"use client";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import MfaChallengeModal from "../challengeMFA/page";

function SignInComp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [factors, setFactors] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totpVerified, setTotpVerified] = useState(false);
  const [totpNotVerified, setTotpNotVerified] = useState(false);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const router = useRouter();

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

  async function handleSignIn(e) {
    e.preventDefault();
    const supabase = createClientComponentClient();

    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      const { data: factors, error: factorError } =
        await supabase.auth.mfa.listFactors();
      if (error) {
        throw error;
      }

      setFactors(factors.totp);

      if (error || totpNotVerified) {
        setError(error.message);
      } else {
        if (factors.totp.length > 0) {
          // MFA is enabled, prompt for verification code
          setIsLoading(true); // Show loading state while waiting for MFA input
          router.push("/authMFA");
        } else {
          // MFA is not enabled, proceed with login
          router.push("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center min-h-screen">
      <div className="w-full flex flex-col h-full items-center justify-center px-4 md:px-12 lg:px-24 gap-16">
        <div className="w-full lg:text-left text-center">
          <h1 className="text-4xl font-medium text-[#202020]">Welcome back</h1>
          <p className="text-xl font-light text-[#3C4049]">
            Enter your account details.
          </p>
        </div>
        {error && (
          <div className="bg-red-600 text-white w-full text-center p-4 rounded-xl">
            Error: {error}
          </div>
        )}
        <form className="w-full flex flex-col gap-6">
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
              value={email}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-slate-200 p-4 rounded-lg"
            />
          </div>
          {/* Checkbox */}
          <Link href="/forget-password" className="underline font-light">
            Forgot password?
          </Link>
          <button
            onClick={handleSignIn}
            className="bg-[#202020] rounded-full text-lg font-medium text-white w-full p-4 hover:opacity-90 transition"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        {/* Already have an account - Login */}
        <p className="font-light text-[#202020] ">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold underline">
            Register here
          </Link>
        </p>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <MfaChallengeModal
                    onConfirm={() => setTotpVerified(true)}
                    onClose={() => setTotpNotVerified(true)}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default SignInComp;
