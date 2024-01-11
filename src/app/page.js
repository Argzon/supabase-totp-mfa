import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[1068px] mx-auto">
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
                type="submit"
                className="bg-[#ffd100] py-4 px-6 flex items-center justify-center rounded-full duration-300 transition-all hover:bg-yellow disabled:bg-darkBlack/20 disabled:cursor-not-allowed w-full"
              >
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
