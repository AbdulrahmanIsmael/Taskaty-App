import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { showError, showSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { supabase } from "@/services/supabase/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEmailChangeStatus } from "@/features/auth/hooks/useEmailChangeStatus";
import { useAuth } from "@/features/auth/hooks/useAuth";
import useUser from "@/features/auth/hooks/useUser";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isEmailChangePending, pendingEmail } = useEmailChangeStatus();
  const { user, userId, loading } = useUser();
  const { deleteAccount, errorMsg } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Editing modes
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!isEditingName) setName(user.user_metadata?.full_name ?? "");
    if (!isEditingEmail) setEmail(user.email ?? "");
  }, [user]);

  const handleUpdateProfile = async () => {
    await supabase.auth.updateUser({
      data: { full_name: name },
    });
    showSuccess("Profile Name Updated", undefined, {
      autoHide: true,
      text1Style: {
        fontSize: 14,
        fontWeight: "500",
      },
    });
    setIsEditingName(false);
  };

  const handleUpdateEmail = async () => {
    if (!email) return;

    // TODO (Supabase): Update user email
    const { error } = await supabase.auth.updateUser({
      email: email,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Email Updated", "Please verify your email address.");
    }

    setIsEditingEmail(false);
  };

  const handleDeleteAllTasks = () => {
    Alert.alert(
      "Delete All Tasks",
      "Are you sure you want to permanently delete all your tasks? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // TODO (Supabase): Delete all tasks for this user
            await supabase.from("tasks").delete().eq("user_id", userId);
            showSuccess("Tasks Deleted", undefined, {
              autoHide: true,
              text1Style: {
                fontSize: 14,
                fontWeight: "500",
              },
            });
          },
        },
      ],
    );
  };

  const handleDeletePastTasks = () => {
    Alert.alert(
      "Delete Past Tasks",
      "Are you sure you want to delete all tasks from previous days?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // TODO (Supabase): Delete tasks where date is before today
            const today = new Date().toISOString();
            await supabase
              .from("tasks")
              .delete()
              .eq("user_id", userId)
              .lt("date", today);
            showSuccess("Past Tasks Deleted", undefined, {
              autoHide: true,
              text1Style: {
                fontSize: 14,
                fontWeight: "500",
              },
            });
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure you want to delete your account? All your data will be permanently erased.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAccount();
            if (!success) {
              showError(
                "Failed to delete account",
                errorMsg ?? "Please try again later.",
              );
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 40,
        paddingTop: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <View style={styles.card}>
          {/* NAME FIELD */}
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Full Name</Text>
            {!isEditingName && (
              <TouchableOpacity
                onPress={() => setIsEditingName(true)}
                style={styles.editIconBtn}
              >
                <Ionicons
                  name="pencil-outline"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>

          {!isEditingName ? (
            <Text style={styles.fieldValueText}>{name || "Not set"}</Text>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor={colors.gray500}
              />
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsEditingName(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={handleUpdateProfile}
                >
                  <Text style={styles.updateBtnText}>Save Name</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* EMAIL FIELD */}
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Email Address</Text>
            {!isEditingEmail && (
              <TouchableOpacity
                onPress={() => setIsEditingEmail(true)}
                style={styles.editIconBtn}
              >
                <Ionicons
                  name="pencil-outline"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>

          {!isEditingEmail ? (
            <Text style={styles.fieldValueText}>{email || "Not set"}</Text>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@example.com"
                placeholderTextColor={colors.gray500}
              />
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsEditingEmail(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={handleUpdateEmail}
                >
                  <Text style={styles.updateBtnText}>Save Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isEmailChangePending && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: colors.primary }}>
                A confirmation link has been sent to your new email
              </Text>
              <Text style={{ fontWeight: "bold", color: colors.primary }}>
                {pendingEmail}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* PASSWORD FIELD (LINK) */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push("/(main)/change-password")}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.gray900}
              />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Change Password</Text>
              <Text style={styles.actionSubtitle}>
                Update your security credentials
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeletePastTasks}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color={colors.gray900}
              />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Delete Past Tasks</Text>
              <Text style={styles.actionSubtitle}>
                Remove all tasks from previous days
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAllTasks}
          >
            <View
              style={[styles.actionIconWrap, { backgroundColor: "#FEF2F2" }]}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={[styles.actionTitle, { color: colors.danger }]}>
                Delete All Tasks
              </Text>
              <Text style={styles.actionSubtitle}>
                Permanently erase your entire task list
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.danger }]}>
          Danger Zone
        </Text>

        <View style={[styles.card, styles.dangerCard]}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAccount}
          >
            <View
              style={[
                styles.actionIconWrap,
                { backgroundColor: "transparent" },
              ]}
            >
              <Ionicons
                name="warning-outline"
                size={24}
                color={colors.danger}
              />
            </View>
            <View style={styles.actionTextWrap}>
              <Text style={[styles.actionTitle, { color: colors.danger }]}>
                Delete Account
              </Text>
              <Text style={styles.actionSubtitle}>
                Permanently delete your account and all data
              </Text>
            </View>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.gray900,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray900,
  },
  editIconBtn: {
    padding: 4,
    backgroundColor: "#F3E8FF",
    borderRadius: 8,
  },
  fieldValueText: {
    fontSize: 16,
    color: colors.gray900,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.gray900,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  updateBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  updateBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  cancelBtn: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.gray900,
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginVertical: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 14,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.gray500,
  },
});
