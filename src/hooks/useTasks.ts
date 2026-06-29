import { useCallback, useEffect, useState } from 'react';

import { loadTasks, saveTasks } from '@/services/taskStorage';
import type { Task } from '@/types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved tasks once when the screen mounts.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const stored = await loadTasks();
      if (!cancelled) {
        setTasks(stored);
        setLoading(false);
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist whenever tasks change — but skip until the first load finishes.
  useEffect(() => {
    if (loading) {
      return;
    }
    void saveTasks(tasks).catch(() => {
      // Storage failures are non-fatal for the demo; avoid unhandled rejections.
    });
  }, [tasks, loading]);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmed,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    removeTask,
    remainingCount,
  };
}
