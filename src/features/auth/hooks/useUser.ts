import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase/client";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };
    fetchUser();

    // Keep user fresh whenever the session changes (sign-in, update, sign-out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    userId: user?.id ?? "",
    loading,
  };
};

export default useUser;
