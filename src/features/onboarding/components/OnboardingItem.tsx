import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { I_onboardingData } from "../onboarding-types";
import { colors } from "@/theme/colors";

const OnboardingItem = ({
  item,
  width,
}: {
  item: I_onboardingData;
  width: number;
}) => {
  return (
    <View style={[styles.onboardingItem, { width }]}>
      <View style={styles.imageContainer} pointerEvents="none">
        <MaterialCommunityIcons name={item.iconName} size={120} color={colors.white} />
      </View>
      <View style={styles.textContainer} pointerEvents="none">
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  onboardingItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    width: 250,
    height: 250,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 16,
    color: colors.white,
    textAlign: "center",
  },
  description: {
    fontWeight: "400",
    fontSize: 16,
    color: colors.gray200,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default OnboardingItem;
