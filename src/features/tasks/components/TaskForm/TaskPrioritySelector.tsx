import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Priority } from "../../types";
import { colors } from "../../../../theme/colors";

interface TaskPrioritySelectorProps {
  priority: Priority;
  onSelect: (priority: Priority) => void;
}

const priorityOptions: {
  value: Priority;
  label: string;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    value: "high",
    label: "High",
    color: colors.danger,
    bg: "#FEF2F2",
    icon: "flame-outline",
  },
  {
    value: "medium",
    label: "Medium",
    color: colors.warning,
    bg: "#FFFBEB",
    icon: "alert-circle-outline",
  },
  {
    value: "low",
    label: "Low",
    color: colors.success,
    bg: "#F0FDF4",
    icon: "leaf-outline",
  },
];

export function TaskPrioritySelector({
  priority,
  onSelect,
}: TaskPrioritySelectorProps) {
  return (
    <View style={styles.container}>
      {priorityOptions.map((opt) => {
        const isActive = priority === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.option,
              isActive && {
                backgroundColor: opt.bg,
                borderColor: opt.color,
              },
            ]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={opt.icon}
              size={16}
              color={isActive ? opt.color : colors.gray500}
            />
            <Text
              style={[
                styles.label,
                isActive && { color: opt.color, fontWeight: "700" },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderRadius: 12,
    gap: 6,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray500,
  },
});
