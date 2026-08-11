import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Task } from "../../features/tasks/types";
import { TaskForm } from "../../features/tasks/components/TaskForm/index";
import { TaskList } from "../../features/tasks/components/TaskList";
import { colors } from "../../theme/colors";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase/client";
import useUser from "@/features/auth/hooks/useUser";

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { userId } = useUser();
  useEffect(() => {
    const getTasksForUser = async () => {
      if (userId) {
        const { data } = await supabase
          .from("tasks")
          .select()
          .eq("user_id", userId);
        if (data) {
          setTasks(data as Task[]);
        }
      }
    };
    getTasksForUser();
  });

  const handleToggleComplete = async (taskId: string) => {
    await supabase
      .from("tasks")
      .update({
        completed: !tasks.find((t) => t.id === taskId)?.completed,
      })
      .eq("id", taskId);

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    await supabase.from("tasks").delete().eq("id", taskId);

    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find((t) => t.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsFormVisible(true);
    }
  };

  const handleSubmitTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "completed">,
  ) => {
    if (editingTask) {
      await supabase.from("tasks").update(taskData).eq("id", editingTask.id);

      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)),
      );
    } else {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...taskData, user_id: userId }])
        .select()
        .single();

      console.log("error; ", error);

      if (data) {
        const newTask: Task = {
          ...taskData,
          id: data?.id,
          createdAt: data?.createdAt || new Date().toISOString(),
          completed: false,
        };
        setTasks([newTask, ...tasks]);
      }
    }
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setEditingTask(null);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <View style={styles.container}>
      {/* Stats bar */}
      {tasks.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {pendingCount}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      )}

      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsFormVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      <TaskForm
        visible={isFormVisible}
        onClose={closeForm}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.gray900,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: "70%",
    alignSelf: "center",
    backgroundColor: colors.gray200,
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default Home;
