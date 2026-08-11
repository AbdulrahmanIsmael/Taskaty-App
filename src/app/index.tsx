import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useFirstLaunch } from "@/shared/hooks/useFirstLaunch";
import { supabase } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";
import { router } from "expo-router";

const Index = () => {
  const { loading: firstLaunchLoading, isFirstLaunch } = useFirstLaunch();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
        return;
      }
      setUser(data.user);
      setAuthLoading(false);
    };

    checkUser();
  }, []);

  if (firstLaunchLoading || authLoading) return null;
  if (isFirstLaunch) return <Redirect href="/onboarding" />;

  return <Redirect href={user ? "/(main)/home" : "/(auth)/login"} />;
};

export default Index;
