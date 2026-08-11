import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "../../theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  const profileName = user?.user_metadata?.full_name || "Profile";

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="checkmark-done" size={20} color={colors.white} />
          </View>
          <Text style={styles.logoText}>Taskaty</Text>
        </View>
        <Text style={styles.tagline}>Stay organized, stay ahead.</Text>
      </View>

      {/* Nav Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={styles.footerItem} 
          onPress={() => router.push("/(main)/profile")}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={22} color={colors.gray500} style={styles.footerItemIcon} />
          <Text style={styles.footerItemText}>{profileName}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerItem} 
          onPress={() => router.push("/(main)/settings")}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color={colors.gray500} style={styles.footerItemIcon} />
          <Text style={styles.footerItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <View style={styles.logoutIconWrap}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 46,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginBottom: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  footerItemIcon: {
    marginRight: 14,
  },
  footerItemText: {
    fontSize: 15,
    color: colors.gray900,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 12,
    marginTop: 8,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    color: colors.danger,
    fontWeight: "600",
  },
});
