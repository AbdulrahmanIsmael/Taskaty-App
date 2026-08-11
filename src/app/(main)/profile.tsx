import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { colors } from "../../theme/colors";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCompletedTasks from "@/features/tasks/hooks/useCompletedTasks";
import { useStreak } from "@/features/tasks/hooks/useStreak";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const completedTasks = useCompletedTasks();
  const streak = useStreak();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Taskaty User";
  const email = user?.email || "user@example.com";
  // Get initials for avatar (max 2 characters)
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={true}
    >
      {/* Header Background */}
      <View style={[styles.headerGradient, { height: 180 + insets.top }]}>
        <View style={styles.headerPattern} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={styles.activeDot} />
        </View>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <View style={[styles.statIconWrap, { backgroundColor: "#F0FDF4" }]}>
            <Ionicons name="checkmark-done" size={20} color={colors.success} />
          </View>
          {/* TODO (Supabase): Fetch completed tasks count for the user */}
          {/* const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true) */}
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIconWrap, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="flame" size={20} color={colors.danger} />
          </View>
          {/* TODO (Supabase): Calculate current streak by fetching recent tasks */}
          {/* const { data } = await supabase.from('tasks').select('completed_at').eq('user_id', user.id).order('completed_at', { ascending: false }) */}
          <Text style={styles.statNumber}>
            {streak} {streak === 1 ? "Day" : "Days"}
          </Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>

      {/* Info Sections */}
      <View style={styles.sectionsContainer}>
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.gray500}
              />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{fullName}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.gray500} />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.gray500}
              />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{joinDate}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerGradient: {
    width: "100%",
    position: "absolute",
    top: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.primary,
  },
  headerPattern: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -width * 0.8,
    right: -width * 0.4,
  },
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 80,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  activeDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.gray900,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 4,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.gray900,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: "500",
    marginTop: 2,
  },
  sectionsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 12,
    marginLeft: 4,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 14,
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.gray900,
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: 66,
    marginRight: 12,
  },
});
