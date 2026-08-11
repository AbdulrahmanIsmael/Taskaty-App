import { useState } from "react";
import { supabase } from "@/services/supabase/client";
import { Keyboard } from "react-native";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        switch (error.code) {
          case "invalid_credentials":
            setErrorMsg("Please check your email and password");
            break;
          case "unconfirmed_identity_provider":
            setErrorMsg("Please verify your email address");
            break;
          default:
            setErrorMsg("Something went wrong, Please try again");
            break;
        }
        return false;
      }

      if (!data.session) {
        // Needs email verification
        return false;
      }

      return true;
    } catch (err) {
      console.log(err);
      setErrorMsg("Something went wrong, Please try again!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ success: boolean; sessionCreated: boolean }> => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return { success: false, sessionCreated: false };
      }

      return { success: true, sessionCreated: !!data.session };
    } catch (err) {
      console.log(err);
      setErrorMsg("Something went wrong. Please try again.");
      return { success: false, sessionCreated: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMsg,
    setErrorMsg,
    signIn,
    signUp,
  };
};
