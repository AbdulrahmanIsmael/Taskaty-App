import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Priority, Task } from "../../types";
import { useEffect, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { TaskPrioritySelector } from "./TaskPrioritySelector";
import { TaskSchedulePicker } from "./TaskSchedulePicker";
import { colors } from "../../../../theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  initialData?: Task | null;
}

export function TaskForm({
  visible,
  onClose,
  onSubmit,
  initialData,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const insets = useSafeAreaInsets();

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const prevVisible = useRef(false);

  // Populate fields if initialData is provided
  useEffect(() => {
    const justOpened = visible && !prevVisible.current;
    prevVisible.current = visible;

    if (justOpened) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || "");
        setPriority(initialData.priority);

        if (initialData.date || initialData.time) {
          const d = new Date();
          if (initialData.date) {
            const parsedDate = new Date(initialData.date);
            if (!isNaN(parsedDate.getTime())) {
              d.setFullYear(
                parsedDate.getFullYear(),
                parsedDate.getMonth(),
                parsedDate.getDate(),
              );
            }
          }
          if (initialData.time) {
            const timeMatch = initialData.time.match(/(\d+):(\d+) (AM|PM)/i);
            if (timeMatch) {
              let [_, h, m, ampm] = timeMatch;
              let hours = parseInt(h);
              if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
              if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
              d.setHours(hours, parseInt(m), 0, 0);
            }
          }
          setDate(d);
        } else {
          setDate(undefined);
        }
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDate(undefined);
      }
    }

    if (visible) {
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        damping: 22,
        stiffness: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    let formattedDate = undefined;
    let formattedTime = undefined;

    if (date) {
      formattedDate = date.toLocaleDateString();
      formattedTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    onSubmit({
      title,
      description,
      priority,
      date: formattedDate,
      time: formattedTime,
    });

    // onClose handles the reset when modal closes
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={styles.keyboardView} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: SCREEN_HEIGHT * 0.9,
              paddingBottom: insets.bottom,
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditing ? "Edit Task" : "New Task"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color={colors.gray500} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.flexShrink}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.formInner}
            >
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="What needs to be done?"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={colors.gray500}
                returnKeyType="next"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.gray500}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Priority</Text>
              <TaskPrioritySelector
                priority={priority}
                onSelect={setPriority}
              />

              <Text style={styles.label}>Schedule (Optional)</Text>
              <TaskSchedulePicker date={date} onDateChange={setDate} />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !title.trim() && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!title.trim()}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={
                    isEditing
                      ? "checkmark-circle-outline"
                      : "add-circle-outline"
                  }
                  size={20}
                  color={colors.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitText}>
                  {isEditing ? "Update Task" : "Create Task"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  flexShrink: {
    flexShrink: 1,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray200,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.gray900,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  formInner: {
    padding: 20,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.gray900,
  },
  textArea: {
    minHeight: 88,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray200,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
