"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/signin");
      }
    };
    getSession();
  }, [supabase.auth, router]);

  const handleSignOut = async () => {
    const { data, err } = await supabase.auth.signOut();
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully signed out");
      router.push("/signin");
    }
  };
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <h2 className="text-2xl">You are signed in</h2>
      <Link
        className="bg-[#ffd100] px-6 py-4 rounded-md font-bold"
        href="/profile"
      >
        Click to view your profile
      </Link>
      <div className="absolute bottom-6">
        <button
          onClick={handleSignOut}
          className="bg-slate-300 rounded-2xl px-6 py-4 hidden lg:flex gap-4 items-center justify-center duration-300 transition-all hover:bg-slate-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
