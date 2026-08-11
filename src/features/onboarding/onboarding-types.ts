import { ComponentProps } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface I_onboardingData {
  id: string;
  title: string;
  description: string;
  iconName: ComponentProps<typeof MaterialCommunityIcons>["name"];
}
