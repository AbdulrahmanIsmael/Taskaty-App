import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logoText}>{title}</Text>
      <Text style={styles.subtitleText}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.gray500,
    fontWeight: "400",
    textAlign: "center",
  },
});
