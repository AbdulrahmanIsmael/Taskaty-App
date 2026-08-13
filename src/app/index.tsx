// app/index.tsx
import { useEffect, useState } from "react";

import { Redirect } from "expo-router";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase/client";
import { useFirstLaunch } from "@/shared/hooks/useFirstLaunch";

const Index = () => {
  const { loading: firstLaunchLoading, isFirstLaunch } = useFirstLaunch();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        // if component unmounted, do nothing!
        if (!isMounted) return;

        if (error || !data.user) {
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };
    checkUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (firstLaunchLoading || authLoading) return null;

  if (isFirstLaunch) return <Redirect href="/onboarding" />;

  return <Redirect href={user ? "/(main)/home" : "/(auth)/login"} />;
};

export default Index;
