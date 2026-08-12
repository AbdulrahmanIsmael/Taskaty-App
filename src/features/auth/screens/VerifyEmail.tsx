import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/services/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const VerifyEmail = () => {
  const router = useRouter();
  const { email, password } = useLocalSearchParams<{
    email: string;
    password: string;
  }>();

  const [checking, setChecking] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!email || !password) return;

    const trySignIn = async () => {
      setChecking(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string,
      });
      setChecking(false);

      if (!error) {
        showSuccess("Email Verified", "Welcome to Taskaty! 🎉");
      }
    };

    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasBackground =
        appState.current === "background" || appState.current === "inactive";
      const isNowActive = nextState === "active";

      if (wasBackground && isNowActive) {
        trySignIn();
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [email, password]);

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      email: email as string,
      type: "signup",
    });

    if (error) {
      showError(
        "Failed To Send Email",
        error?.message || "Something went wrong. Please try again.",
      );
      return;
    }

    showSuccess(
      "Email Resent",
      "Check your inbox for the confirmation message",
    );
  };

  const handleVerified = async () => {
    if (!email || !password) {
      router.replace("/(auth)/login");
      return;
    }

    setChecking(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setChecking(false);

    if (error) {
      if (
        error.message.toLowerCase().includes("not confirmed") ||
        error.code === "email_not_confirmed"
      ) {
        showError(
          "Not Verified Yet",
          "Please verify your email address via the link sent to your inbox.",
        );
        return;
      }

      showError(
        "Sign In Failed",
        error.message || "Failed to sign in. Please try again.",
      );
      return;
    }

    showSuccess("Email Verified", "Welcome to Taskaty! 🎉");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Feather name="mail" size={64} color={colors.primary} />
        </View>

        <Text style={styles.title}>Check your email</Text>

        <Text style={styles.description}>
          We sent a confirmation link to{"\n"}
          <Text style={styles.emailText}>{email || "your email address"}</Text>
        </Text>

        {/* Auto-check status badge */}
        {checking ? (
          <View style={styles.checkingBadge}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.checkingText}>Checking verification…</Text>
          </View>
        ) : (
          <View style={styles.checkingBadge}>
            <Feather name="zap" size={14} color={colors.primary} />
            <Text style={styles.checkingText}>
              We'll sign you in automatically once verified
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleVerified}
            disabled={checking}
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || checking) && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>I'm verified</Text>
          </Pressable>

          <Pressable
            onPress={handleResend}
            disabled={checking}
            style={({ pressed }) => [
              styles.secondaryButton,
              (pressed || checking) && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              Resend confirmation email
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(106, 61, 232, 0.1)",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.gray900,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.gray500,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emailText: {
    fontWeight: "700",
    color: colors.primary,
  },
  checkingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3E8FF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 32,
  },
  checkingText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default VerifyEmail;
