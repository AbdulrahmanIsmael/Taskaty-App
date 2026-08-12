import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { supabase } from "@/services/supabase/client";

export const useEmailChangeStatus = () => {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const checkEmailChangeStatus = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log("Failed to get user:", error);
      return;
    }

    setPendingEmail(user?.new_email ?? null);
  };

  useEffect(() => {
    checkEmailChangeStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkEmailChangeStatus();
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          checkEmailChangeStatus();
        }
      },
    );

    return () => {
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  return {
    pendingEmail,
    isEmailChangePending: !!pendingEmail,
  };
};
