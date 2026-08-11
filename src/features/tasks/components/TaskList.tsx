import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../types";
import { TaskItem } from "./TaskItem";
import { colors } from "../../../theme/colors";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons
            name="checkmark-done-outline"
            size={48}
            color={colors.primary}
          />
        </View>
        <Text style={styles.emptyTitle}>All clear!</Text>
        <Text style={styles.emptySubtitle}>
          Tap the <Text style={styles.emptyHighlight}>+</Text> button to add
          your first task.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggleComplete={() => onToggleComplete(item.id)}
          onEdit={() => onEdit(item.id)}
          onDelete={() => onDelete(item.id)}
          key={item.id}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EDE9FC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.gray900,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyHighlight: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
});
