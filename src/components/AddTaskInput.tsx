import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, fontSizes, radius, spacing } from '@/theme';

type AddTaskInputProps = {
  onAdd: (text: string) => void;
};

// Controlled input: local state holds the text; parent receives it via onAdd.
export function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const [text, setText] = useState('');

  function handleAdd() {
    onAdd(text);
    setText('');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="What needs to be done?"
        placeholderTextColor={colors.textMuted}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: colors.card,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
