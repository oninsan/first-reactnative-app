import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, spacing } from '@/theme';

type HeaderProps = {
  remainingCount: number;
};

// Presentational component — receives data via props, no state of its own.
export function Header({ remainingCount }: HeaderProps) {
  const subtitle =
    remainingCount === 1
      ? '1 task remaining'
      : `${remainingCount} tasks remaining`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
});
