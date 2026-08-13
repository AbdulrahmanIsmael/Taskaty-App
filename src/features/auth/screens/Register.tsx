import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from "../helpers/registerValidation";

import { AuthFooter } from "../components/AuthFooter";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { AuthPasswordInput } from "../components/AuthPasswordInput";
import { AuthSubmitButton } from "../components/AuthSubmitButton";
import { colors } from "@/theme/colors";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { signUp, loading, errorMsg, setErrorMsg } = useAuth();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {
      fullName: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
  );

  const setFieldError = (field: string, error: string | null) =>
    setFieldErrors((prev) => ({ ...prev, [field]: error }));

  const handleBlur = (field: string) => {
    setFocusedInput(null);
    switch (field) {
      case "fullName":
        setFieldError("fullName", validateFullName(fullName));
        break;
      case "email":
        setFieldError("email", validateEmail(email));
        break;
      case "password":
        setFieldError("password", validatePassword(password));
        if (fieldErrors.confirmPassword !== null) {
          setFieldError(
            "confirmPassword",
            validateConfirmPassword(confirmPassword, password),
          );
        }
        break;
      case "confirmPassword":
        setFieldError(
          "confirmPassword",
          validateConfirmPassword(confirmPassword, password),
        );
        break;
    }
  };

  const isFormValid = () => {
    const errors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleRegister = async () => {
    if (!isFormValid()) {
      setErrorMsg("Please fill out all required fields!");
      return;
    }

    const { success, sessionCreated } = await signUp(email, password, fullName);

    if (success) {
      if (!sessionCreated) {
        router.replace({
          pathname: "/verify-email",
          params: { email, password },
        });
        return;
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Create Account"
          subtitle="Start organizing your tasks today"
        />

        <View style={styles.formContainer}>
          <AuthInput
            label="Full Name"
            iconName="user"
            value={fullName}
            onChangeText={(v) => {
              setFullName(v);
              if (fieldErrors.fullName)
                setFieldError("fullName", validateFullName(v));
            }}
            placeholder="Enter your full name"
            error={fieldErrors.fullName}
            isFocused={focusedInput === "fullName"}
            onFocus={() => setFocusedInput("fullName")}
            onBlur={() => handleBlur("fullName")}
            autoCapitalize="words"
          />

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
            placeholder="Create a password"
            error={fieldErrors.password}
            isFocused={focusedInput === "password"}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => handleBlur("password")}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <AuthPasswordInput
            label="Confirm Password"
            iconName="lock"
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              if (fieldErrors.confirmPassword)
                setFieldError(
                  "confirmPassword",
                  validateConfirmPassword(v, password),
                );
            }}
            placeholder="Confirm your password"
            error={fieldErrors.confirmPassword}
            isFocused={focusedInput === "confirmPassword"}
            onFocus={() => setFocusedInput("confirmPassword")}
            onBlur={() => handleBlur("confirmPassword")}
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <AuthSubmitButton
            label="Sign Up"
            loadingLabel="Signing up..."
            loading={loading}
            onPress={handleRegister}
          />

          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </View>

        <AuthFooter
          text="Already have an account?"
          linkText="Sign In"
          onPress={() => router.push("/login")}
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
  error: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.danger,
    textAlign: "center",
    marginTop: 12,
  },
});

export default Register;
