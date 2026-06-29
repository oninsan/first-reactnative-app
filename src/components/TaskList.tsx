import { FlatList, StyleSheet } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { TaskItem } from '@/components/TaskItem';
import { spacing } from '@/theme';
import type { Task } from '@/types/task';

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

// FlatList efficiently renders only visible rows — great for longer lists.
export function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  return (
    <FlatList
      style={styles.list}
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={onToggle} onRemove={onRemove} />
      )}
      ListEmptyComponent={EmptyState}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});
