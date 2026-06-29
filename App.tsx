import { StatusBar } from 'expo-status-bar';

import { TasksScreen } from '@/screens/TasksScreen';

export default function App() {
  return (
    <>
      <TasksScreen />
      <StatusBar style="dark" />
    </>
  );
}
