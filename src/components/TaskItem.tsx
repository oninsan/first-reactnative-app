import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, radius, spacing } from '@/theme';
import type { Task } from '@/types/task';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

// One list row — props carry the task data and callbacks from the parent.
export function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.checkbox,
          task.completed && styles.checkboxChecked,
          pressed && styles.checkboxPressed,
        ]}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
      >
        {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <Text
        style={[styles.title, task.completed && styles.titleCompleted]}
        numberOfLines={2}
      >
        {task.title}
      </Text>

      <Pressable
        style={({ pressed }) => [styles.delete, pressed && styles.deletePressed]}
        onPress={() => onRemove(task.id)}
        accessibilityLabel="Delete task"
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.accent,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxPressed: {
    opacity: 0.7,
  },
  checkmark: {
    color: colors.card,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textCompleted,
  },
  delete: {
    marginLeft: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePressed: {
    opacity: 0.7,
  },
  deleteText: {
    color: colors.danger,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});
