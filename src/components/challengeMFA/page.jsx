import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";

function MfaChallengeModal({ onClose, onConfirm }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);

  const supabase = createClientComponentClient();

  const handleConfirm = async () => {
    try {
      const { data: factors, error: factorError } =
        await supabase.auth.mfa.listFactors();
      if (error) {
        throw error;
      }

      const factorId = factors.totp[0].id;

      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setError(challenge.error.message);
        throw challenge.error;
      }
      const challengeId = challenge.data.id;

      await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verificationCode,
      });
      onConfirm(); // Close the modal and proceed with login
    } catch (error) {
      setError(error.message);
      onClose();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl flex flex-col gap-8 p-1">
      {error && <div className="error">{error}</div>}
      <div className="flex justify-between items-center bg-[#F6F7F8] p-4 rounded-2xl">
        <p className="text-2xl">Enter MFA Code</p>{" "}
        <div
          className="w-8 h-8 rounded-[10px] bg-[#202020] text-white flex items-center justify-center cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          X
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-normal">
          Enter the 6-digit code from your authenticator app.
        </p>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Verification Code"
          className="border border-border rounded-[4px] w-full p-4"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleConfirm}
          className="bg-[#FFD100] p-4 mt-2 flex w-full items-center justify-center rounded-full duration-300 transition-all hover:bg-yellow disabled:bg-[#202020]/20 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
        <button
          onClick={onClose}
          className="bg-black text-white p-4 mt-2 w-full flex items-center justify-center rounded-full duration-300 transition-all hover:bg-yellow disabled:bg-[#202020]/20 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MfaChallengeModal;
