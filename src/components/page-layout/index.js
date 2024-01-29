"use client";
import {} from "next/client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function Layout({ children }) {
  const [readyToShow, setReadyToShow] = useState(false);
  const [showMFAScreen, setShowMFAScreen] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const { data, error } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (error) {
          throw error;
        }

        if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
          setShowMFAScreen(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error.message);
      } finally {
        setReadyToShow(true);
      }
    }

    checkAuthentication();
  }, []);

  useEffect(() => {
    // Redirect to MFA setup page if necessary
    if (readyToShow && showMFAScreen) {
      redirect("/authMFA"); // Replace '/authMFA' with your actual MFA setup route
    }
  }, [readyToShow, showMFAScreen]);

  return readyToShow ? <>{children}</> : null;
}

export default Layout;
