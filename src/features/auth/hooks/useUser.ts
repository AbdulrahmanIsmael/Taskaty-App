import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase/client";

const useUser = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  return { userId };
};

export default useUser;
