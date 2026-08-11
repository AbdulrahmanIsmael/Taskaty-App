import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { CustomDrawerContent } from "../../shared/components/CustomDrawerContent";
import { supabase } from "@/services/supabase/client";
import { useEffect, useState } from "react";
import { UserResponse } from "@supabase/supabase-js";

export default function MainLayout() {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userResponse = await supabase.auth.getUser();
      if (!userResponse.error) {
        setUser(userResponse);
      }
    };
    fetchUser();
  }, []);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerShadowVisible: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.gray500,
        // Fix: remove the default border radius on the drawer panel
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: "78%",
        },
        // Fix: smooth overlay — it fades in together with the slide animation
        overlayColor: "rgba(0,0,0,0.45)",
        swipeEdgeWidth: 60,
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Home",
          title: "Tasks",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: user?.data.user?.user_metadata?.full_name || "Profile",
          title: user?.data.user?.user_metadata?.full_name || "Profile",
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="change-password"
        options={{
          drawerLabel: "Change Password",
          title: "Change Password",
          drawerItemStyle: { display: "none" },
        }}
      /> */}
    </Drawer>
  );
}
