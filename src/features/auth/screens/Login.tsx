import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";

import { validateEmail, validatePassword } from "../helpers/loginValidation";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import { AuthInput } from "../components/AuthInput";
import { AuthPasswordInput } from "../components/AuthPasswordInput";
import { AuthSubmitButton } from "../components/AuthSubmitButton";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { signIn, loading, errorMsg, setErrorMsg } = useAuth();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {
      email: null,
      password: null,
    },
  );

  const setFieldError = (field: string, error: string | null) =>
    setFieldErrors((prev) => ({ ...prev, [field]: error }));

  const handleBlur = (field: string) => {
    setFocusedInput(null);
    if (field === "email") setFieldError("email", validateEmail(email));
    if (field === "password")
      setFieldError("password", validatePassword(password));
  };

  const isFormValid = () => {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      setErrorMsg("Either Email or Password is incorrect!");
      return;
    }

    const success = await signIn(email, password);
    if (success) {
      router.replace("/home");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader title="Taskaty" subtitle="Sign in to manage your tasks" />

        <View style={styles.formContainer}>
          <AuthInput
            label="Email Address"
            iconName="mail"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (fieldErrors.email) setFieldError("email", validateEmail(v));
            }}
            placeholder="Enter your email"
            error={fieldErrors.email}
            isFocused={focusedInput === "email"}
            onFocus={() => setFocusedInput("email")}
            onBlur={() => handleBlur("email")}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AuthPasswordInput
            label="Password"
            iconName="lock"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (fieldErrors.password)
                setFieldError("password", validatePassword(v));
            }}
            placeholder="Enter your password"
            error={fieldErrors.password}
            isFocused={focusedInput === "password"}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => handleBlur("password")}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <Pressable style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          <AuthSubmitButton
            label="Sign In"
            loadingLabel="Signing in..."
            loading={loading}
            onPress={handleLogin}
          />

          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </View>

        <AuthFooter
          text="Don't have an account?"
          linkText="Sign Up"
          onPress={() => router.push("/register")}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  formContainer: {
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  error: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.danger,
    textAlign: "center",
    marginTop: 12,
  },
});

export default Login;
