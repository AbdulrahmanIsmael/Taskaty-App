import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task, Priority } from "../types";
import { colors } from "../../../theme/colors";

interface TaskItemProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const priorityConfig: Record<
  Priority,
  { color: string; bg: string; label: string }
> = {
  high: { color: colors.danger, bg: "#FEF2F2", label: "High" },
  medium: { color: colors.warning, bg: "#FFFBEB", label: "Medium" },
  low: { color: colors.success, bg: "#F0FDF4", label: "Low" },
};

export function TaskItem({ task, onPress, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const pc = priorityConfig[task.priority];

  return (
    <TouchableOpacity
      style={[styles.container, task.completed && styles.containerCompleted]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Left priority stripe */}
      <View style={[styles.priorityStripe, { backgroundColor: pc.color }]} />

      {/* Main row */}
      <View style={styles.body}>
        {/* Top row: title + checkbox */}
        <View style={styles.topRow}>
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          <TouchableOpacity
            onPress={onToggleComplete}
            style={styles.checkboxTouch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={task.completed ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={task.completed ? colors.success : colors.gray200}
            />
          </TouchableOpacity>
        </View>

        {/* Description */}
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Footer row: priority badge + date/time + actions */}
        <View style={styles.footerRow}>
          <View style={styles.footerLeft}>
            <View style={[styles.priorityBadge, { backgroundColor: pc.bg }]}>
              <View style={[styles.priorityDot, { backgroundColor: pc.color }]} />
              <Text style={[styles.priorityLabel, { color: pc.color }]}>
                {pc.label}
              </Text>
            </View>

            {(task.date || task.time) && (
              <View style={styles.metaRow}>
                {task.date && (
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color={colors.gray500}
                    />
                    <Text style={styles.metaText}>{task.date}</Text>
                  </View>
                )}
                {task.time && (
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={colors.gray500}
                    />
                    <Text style={styles.metaText}>{task.time}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.actionBtn}>
              <Ionicons name="pencil-outline" size={18} color={colors.gray500} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  containerCompleted: {
    opacity: 0.65,
  },
  priorityStripe: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray900,
    lineHeight: 22,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: colors.gray500,
  },
  checkboxTouch: {
    marginTop: 1,
  },
  description: {
    fontSize: 13,
    color: colors.gray500,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    gap: 10,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 2,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: "500",
  },
});
