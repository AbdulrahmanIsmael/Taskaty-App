import { StyleSheet, Text, View, Pressable } from "react-native";
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

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      email: email as string,
      type: "signup",
    });

    if (error) {
      showError(
        "Failed To Send Email",
        error?.message || "Something went wrong. Please try again."
      );
      return;
    }

    showSuccess(
      "Email Resend",
      "Check your inbox for the confirmation message"
    );
  };

  const handleVerified = async () => {
    if (!email || !password) {
      router.replace("/(auth)/login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("not confirmed") ||
        error.code === "email_not_confirmed"
      ) {
        showError(
          "Not Verified Yet",
          "Please verify your email address via the link sent to your inbox."
        );
        return;
      }

      showError(
        "Sign In Failed",
        error.message || "Failed to sign in. Please try again."
      );
      return;
    }

    showSuccess("Email Verified", "Welcome!");
    router.replace("/(main)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="mail" size={64} color={colors.primary} />
        </View>

        <Text style={styles.title}>Check your email</Text>

        <Text style={styles.description}>
          We have sent a confirmation message to{"\n"}
          <Text style={styles.emailText}>{email || "your email address"}</Text>
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleVerified}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>I'm verified</Text>
          </Pressable>

          <Pressable
            onPress={handleResend}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
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
    backgroundColor: "rgba(106, 61, 232, 0.1)", // Light primary color
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
    marginBottom: 40,
  },
  emailText: {
    fontWeight: "700",
    color: colors.primary,
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
