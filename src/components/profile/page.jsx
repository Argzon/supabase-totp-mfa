"use client";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EnrollMFA from "../enrollMFA/page";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProfileComp() {
  let [isOpen, setIsOpen] = useState(true);
  const supabase = createClientComponentClient();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const router = useRouter();
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
  }, [router, supabase.auth]);

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[1068px] mx-auto">
        <div className="flex justify-between items-center px-8">
          <Link
            className="bg-gray-400 text-white px-6 py-4 rounded-md transition-all duration-300 hover:bg-gray-500"
            href="/"
          >
            Get back to homepage
          </Link>
          <button
            onClick={handleSignOut}
            className="bg-red-300 rounded-2xl px-6 py-4 hidden lg:flex gap-4 items-center justify-center duration-300 transition-all hover:bg-red-400"
          >
            Logout
          </button>
        </div>
        <div className="bg-[#F4F4F4] p-8 rounded-2xl flex flex-col gap-6 text-center">
          <div className="flex flex-col">
            <div className="grid grid-cols-3 text-left py-4 px-6 text-base font-normal uppercase text-darkBlack bg-[#c9c9c9] rounded-t-[4px]">
              <p>Type</p>
              <p>Status</p>
              <p>Action</p>
            </div>
            <div className="grid grid-cols-3 items-center text-left p-6 border border-[#BBBBBB] rounded-b-[4px]">
              <p>Authenticator App</p>
              <p>Not Configured</p>
              <button
                type="button"
                onClick={openModal}
                className="bg-[#ffd100] py-4 px-6 flex items-center justify-center rounded-full duration-300 transition-all hover:bg-yellow disabled:bg-darkBlack/20 disabled:cursor-not-allowed w-full"
              >
                Configure
              </button>
            </div>
          </div>
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
                    <EnrollMFA />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
