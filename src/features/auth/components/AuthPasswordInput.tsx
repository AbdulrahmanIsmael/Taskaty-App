import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/theme/colors";
import { AuthInputProps } from "./AuthInput";

interface AuthPasswordInputProps extends Omit<AuthInputProps, "keyboardType" | "autoCapitalize"> {
  showPassword: boolean;
  onTogglePassword: () => void;
}

export const AuthPasswordInput = ({
  label,
  iconName = "lock",
  value,
  onChangeText,
  placeholder,
  error,
  isFocused,
  onFocus,
  onBlur,
  showPassword,
  onTogglePassword,
}: AuthPasswordInputProps) => {
  const inputBorderStyle = () => {
    if (error) return styles.inputContainerError;
    if (isFocused) return styles.inputContainerFocused;
    return null;
  };

  const iconColor = () => {
    if (error) return colors.danger;
    if (isFocused) return colors.primary;
    return colors.gray500;
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputContainer, inputBorderStyle()]}>
        <Feather
          name={iconName}
          size={20}
          color={iconColor()}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.gray500}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <Pressable onPress={onTogglePassword} style={styles.eyeIcon}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={colors.gray500}
          />
        </Pressable>
      </View>
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.gray900,
  },
  eyeIcon: {
    padding: 4,
  },
  fieldError: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.danger,
    marginTop: 6,
    marginLeft: 4,
  },
});
