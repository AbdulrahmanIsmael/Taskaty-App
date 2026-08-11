import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors } from "@/theme/colors";

interface AuthFooterProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const AuthFooter = ({ text, linkText, onPress }: AuthFooterProps) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>{text} </Text>
      <Pressable onPress={onPress}>
        <Text style={styles.linkText}>{linkText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.gray500,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
