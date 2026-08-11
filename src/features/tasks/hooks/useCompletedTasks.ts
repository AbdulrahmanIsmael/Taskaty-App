import { useEffect, useState } from "react";

import { supabase } from "@/services/supabase/client";
import useUser from "@/features/auth/hooks/useUser";

const useCompletedTasks = () => {
  const [tasks, setTasks] = useState<number>(0);
  const { userId } = useUser();
  useEffect(() => {
    const getDoneTasks = async () => {
      if (userId) {
        const { count } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("completed", true);

        if (count) {
          setTasks(count);
        }
      }
    };
    getDoneTasks();
  });

  return tasks;
};

export default useCompletedTasks;
