import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import { AddTaskInput } from '@/components/AddTaskInput';
import { Header } from '@/components/Header';
import { TaskList } from '@/components/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { colors, spacing } from '@/theme';

// Screen composes UI pieces and delegates state to the useTasks hook.
export function TasksScreen() {
  const { tasks, loading, addTask, toggleTask, removeTask, remainingCount } =
    useTasks();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Header remainingCount={remainingCount} />
          <AddTaskInput onAdd={addTask} />
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onRemove={removeTask}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
