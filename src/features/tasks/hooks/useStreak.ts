import { useEffect, useState } from "react";
import useUser from "@/features/auth/hooks/useUser";
import { supabase } from "@/services/supabase/client";
import { calculateStreak } from "../utils/streak";

export function useStreak(): number {
  const [streak, setStreak] = useState<number>(0);
  const { userId } = useUser();

  useEffect(() => {
    const getStreak = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("completed_at")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      if (error || !data) return;

      const dates = data.map((row) => row.completed_at as string);
      setStreak(calculateStreak(dates));
    };
    getStreak();
  }, [userId]);

  return streak;
}
