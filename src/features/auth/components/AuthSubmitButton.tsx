import { StyleSheet, Text, Pressable } from "react-native";
import { colors } from "@/theme/colors";

interface AuthSubmitButtonProps {
  label: string;
  loadingLabel: string;
  loading: boolean;
  onPress: () => void;
}

export const AuthSubmitButton = ({
  label,
  loadingLabel,
  loading,
  onPress,
}: AuthSubmitButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        loading && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText}>{loading ? loadingLabel : label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
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
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
