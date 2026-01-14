import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import type { CalendarTask } from '@domain/calendar/types';
import { Button } from '@ui/components/Button';
import { Input } from '@ui/components/Input';
import { useTheme } from '@ui/theme';

type TaskDetailSheetProps = {
  task: CalendarTask | null;
  visible: boolean;
  onClose: () => void;
  onMarkDone: (task: CalendarTask) => void;
  onReschedule: (task: CalendarTask, nextDate: string) => void;
};

const isValidDate = (value: string): boolean => !Number.isNaN(Date.parse(value));

export const TaskDetailSheet = ({
  task,
  visible,
  onClose,
  onMarkDone,
  onReschedule,
}: TaskDetailSheetProps): React.ReactElement | null => {
  const theme = useTheme();
  const [nextDate, setNextDate] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (task) {
      setNextDate(task.dueDate);
      setError(null);
    }
  }, [task]);

  if (!task) {
    return null;
  }

  const handleReschedule = (): void => {
    if (!nextDate.trim()) {
      setError('New date is required.');
      return;
    }
    if (!isValidDate(nextDate.trim())) {
      setError('Enter a valid date.');
      return;
    }
    setError(null);
    onReschedule(task, nextDate.trim());
  };

  const handleMarkDone = (): void => {
    onMarkDone(task);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius.sheet,
            borderTopRightRadius: theme.radius.sheet,
            padding: theme.spacing.lg,
          }}
        >
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: theme.typography.sizes.h2,
              fontWeight: theme.typography.weights.bold,
            }}
          >
            {task.title}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.bodyM,
              marginTop: theme.spacing.xs,
            }}
          >
            {task.plantName} · Due {task.dueDate}
          </Text>
          <View style={{ marginTop: theme.spacing.lg }}>
            <Input
              label="Reschedule date"
              value={nextDate}
              onChangeText={setNextDate}
              helperText="YYYY-MM-DD"
              {...(error ? { errorText: error } : {})}
            />
          </View>
          <View style={{ marginTop: theme.spacing.lg }}>
            <Button label="Reschedule" onPress={handleReschedule} />
          </View>
          <View style={{ marginTop: theme.spacing.sm }}>
            <Button
              label="Mark done"
              variant="secondary"
              onPress={handleMarkDone}
              disabled={task.status === 'done'}
            />
          </View>
          <View style={{ marginTop: theme.spacing.sm }}>
            <Button label="Close" variant="tertiary" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
