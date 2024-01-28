"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EnrollMFA({ setIsModalOpen }) {
  const [factorId, setFactorId] = useState("");
  const [qr, setQR] = useState(""); // holds the QR code image SVG
  const [verifyCode, setVerifyCode] = useState(""); // contains the code entered by the user
  const [error, setError] = useState(""); // holds an error message

  const supabase = createClientComponentClient();

  const onEnableClicked = () => {
    setError("");
    (async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setError(challenge.error.message);
        throw challenge.error;
      }

      const challengeId = challenge.data.id;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });
      if (verify.error) {
        setError(verify.error.message);
        throw verify.error;
      }
    })();
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) {
        throw error;
      }

      setFactorId(data.id);

      // Supabase Auth returns an SVG QR code which you can convert into a data
      // URL that you can place in an <img> tag.
      setQR(data.totp.qr_code);
    })();
  }, [supabase.auth.mfa]);

  return (
    <div className="w-full bg-white rounded-2xl flex flex-col gap-8 p-1">
      {error && <div className="error">{error}</div>}
      <div className="flex justify-between items-center bg-[#F6F7F8] p-4 rounded-2xl">
        <p className="text-2xl">Set-up Multi Factor Authentication</p>{" "}
        <div
          className="w-8 h-8 rounded-[10px] bg-[#202020] text-white flex items-center justify-center cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          X
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <p className="text-xl font-bold">
          Scan the QR code below with your authenticator app:
        </p>
        <div className="flex items-center justify-center">
          <Image src={qr} height={300} width={300} alt="QR Code" />
        </div>
      </div>
      {/* divider */}
      <div className="w-full h-px bg-gray"></div>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold">
          Enter the passcode from your authenticator app:
        </p>
        <input
          type="text"
          className="border border-border rounded-[4px] w-full p-4"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
        />
      </div>
      <input
        className="bg-[#FFD100] p-4 mt-2 flex items-center justify-center rounded-full duration-300 transition-all hover:bg-yellow disabled:bg-[#202020]/20 disabled:cursor-not-allowed"
        type="button"
        value="Enable"
        onClick={onEnableClicked}
      />
    </div>
  );
}
