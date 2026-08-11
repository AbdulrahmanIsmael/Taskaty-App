import { StyleSheet, Text, TextInput, View, KeyboardTypeOptions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/theme/colors";

export interface AuthInputProps {
  label: string;
  iconName: keyof typeof Feather.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string | null;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export const AuthInput = ({
  label,
  iconName,
  value,
  onChangeText,
  placeholder,
  error,
  isFocused,
  onFocus,
  onBlur,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: AuthInputProps) => {
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
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
        />
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
  fieldError: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.danger,
    marginTop: 6,
    marginLeft: 4,
  },
});
