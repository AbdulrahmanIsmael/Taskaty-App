import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showError, showSuccess } from "@/utils/toast";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { router } from "expo-router";
import { supabase } from "@/services/supabase/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useUser from "@/features/auth/hooks/useUser";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(main)/settings");
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      showError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(
        "Passwords do not match",
        "New password and confirmation must be the same.",
      );
      return;
    }

    setLoading(true);

    const email = user?.email;

    if (!email) {
      showError("Unable to verify identity", "Please log in again and retry.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      showError("Current password is incorrect");
      setLoading(false);
      return;
    }

    // Update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (updateError) {
      showError("Failed to update password", updateError.message);
      return;
    }

    showSuccess(
      "Password Updated",
      "Your password has been changed successfully.",
      {
        autoHide: true,
        text1Style: { fontSize: 14, fontWeight: "500" },
      },
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    goBack();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 40,
        paddingTop: 20,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Change Password</Text>
        <Text style={styles.screenSubtitle}>
          Update your security credentials below
        </Text>
      </View>

      {/* Password Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>

        <View style={styles.card}>
          {/* Current Password */}
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Current Password</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor={colors.gray500}
              secureTextEntry={!showCurrent}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowCurrent((v) => !v)}
            >
              <Ionicons
                name={showCurrent ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.gray500}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* New Password */}
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>New Password</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.gray500}
              secureTextEntry={!showNew}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowNew((v) => !v)}
            >
              <Ionicons
                name={showNew ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.gray500}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Confirm New Password */}
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Confirm New Password</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter new password"
              placeholderTextColor={colors.gray500}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirm((v) => !v)}
            >
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.gray500}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hint */}
      <View style={styles.hintCard}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={colors.primary}
          style={{ marginTop: 1 }}
        />
        <Text style={styles.hintText}>
          For your security, you'll be asked to confirm your current password
          before making any changes.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsSection}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={goBack}
          disabled={loading}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.updateBtn, loading && styles.updateBtnDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.updateBtnText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
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
  screenSubtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
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
  fieldHeader: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray900,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 15,
    color: colors.gray900,
    marginBottom: 4,
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 13,
    padding: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginVertical: 16,
  },
  hintCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: "#F3E8FF",
    borderRadius: 14,
    padding: 14,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 19,
    fontWeight: "500",
  },
  actionButtonsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 20,
  },
  updateBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 150,
  },
  updateBtnDisabled: {
    opacity: 0.6,
  },
  updateBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.gray900,
    fontWeight: "600",
    fontSize: 15,
  },
});
