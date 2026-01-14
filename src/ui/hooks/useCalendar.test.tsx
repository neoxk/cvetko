import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import type { CalendarRepository } from '@data/calendar/repository';
import type { CalendarTask } from '@domain/calendar/types';
import { useCalendar } from './useCalendar';

const task: CalendarTask = {
  id: 'task-1',
  plantId: 'p1',
  plantName: 'Aloe',
  type: 'water',
  title: 'Water Aloe',
  dueDate: '2024-01-01',
  status: 'pending',
  recurrence: null,
  completedAt: null,
  notes: null,
};

describe('useCalendar', () => {
  it('updates tasks optimistically', async () => {
    const repository: CalendarRepository = {
      getAll: jest.fn().mockResolvedValue([task]),
      add: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn(),
      getById: jest.fn().mockResolvedValue(task),
    };

    const { result } = renderHook(() => useCalendar({ repository }));

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      result.current.updateTask({ ...task, status: 'done', completedAt: '2024-01-02' });
    });

    expect(result.current.tasks[0]?.status).toBe('done');
  });

  it('rolls back on update errors', async () => {
    const repository: CalendarRepository = {
      getAll: jest.fn().mockResolvedValue([task]),
      add: jest.fn(),
      update: jest.fn().mockRejectedValue(new Error('fail')),
      remove: jest.fn(),
      getById: jest.fn().mockResolvedValue(task),
    };

    const { result } = renderHook(() => useCalendar({ repository }));

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      result.current.updateTask({ ...task, status: 'done', completedAt: '2024-01-02' });
    });

    expect(result.current.tasks[0]?.status).toBe('done');

    await waitFor(() => {
      expect(result.current.tasks[0]?.status).toBe('pending');
    });
  });
});
