import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { supabase } from "@/services/supabase/client";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useNetInfo } from "@react-native-community/netinfo";
import { OfflineModal } from "@/shared/components/OfflineModal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const netInfo = useNetInfo();
  const isOffline =
    netInfo.isConnected === false ||
    (netInfo.isConnected !== null && netInfo.isInternetReachable === false);

  useEffect(() => {
    const checkUserExists = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
      }
    };

    checkUserExists();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.replace("/(auth)/login");
        return;
      }

      if (event === "SIGNED_IN") {
        router.replace("/(main)/home");
        return;
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="onboarding"
            options={{
              animation: "fade",
            }}
          />
        </Stack>
      </SafeAreaView>

      <OfflineModal visible={isOffline} />

      <Toast />
    </GestureHandlerRootView>
  );
}
