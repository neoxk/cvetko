import { generateCalendarTasks } from './rules';
import type { CalendarTaskSchedule } from './types';

const baseSchedule: CalendarTaskSchedule = {
  plantId: 'p1',
  plantName: 'Aloe',
  taskType: 'water',
  title: 'Water Aloe',
  startDate: '2024-01-01',
  recurrence: {
    frequency: 'daily',
    interval: 1,
  },
};

describe('calendar rules', () => {
  it('generates daily tasks by interval', () => {
    const tasks = generateCalendarTasks(
      { ...baseSchedule, recurrence: { frequency: 'daily', interval: 2 } },
      { endDate: '2024-01-07' },
    );

    expect(tasks.map((task) => task.dueDate)).toEqual([
      '2024-01-01',
      '2024-01-03',
      '2024-01-05',
      '2024-01-07',
    ]);
  });

  it('generates weekly tasks on specific weekdays', () => {
    const tasks = generateCalendarTasks(
      {
        ...baseSchedule,
        recurrence: { frequency: 'weekly', interval: 1, weekdays: ['mon', 'thu'] },
      },
      { endDate: '2024-01-14' },
    );

    expect(tasks.map((task) => task.dueDate)).toEqual([
      '2024-01-01',
      '2024-01-04',
      '2024-01-08',
      '2024-01-11',
    ]);
  });

  it('respects weekly intervals', () => {
    const tasks = generateCalendarTasks(
      {
        ...baseSchedule,
        recurrence: { frequency: 'weekly', interval: 2, weekdays: ['mon'] },
      },
      { endDate: '2024-01-21' },
    );

    expect(tasks.map((task) => task.dueDate)).toEqual(['2024-01-01', '2024-01-15']);
  });

  it('skips invalid month days for monthly recurrence', () => {
    const tasks = generateCalendarTasks(
      {
        ...baseSchedule,
        recurrence: { frequency: 'monthly', interval: 1, monthDays: [1, 15, 31] },
        startDate: '2024-01-10',
      },
      { endDate: '2024-03-05' },
    );

    expect(tasks.map((task) => task.dueDate)).toEqual([
      '2024-01-15',
      '2024-01-31',
      '2024-02-01',
      '2024-02-15',
      '2024-03-01',
    ]);
  });

  it('throws for invalid recurrence configuration', () => {
    expect(() =>
      generateCalendarTasks(
        { ...baseSchedule, recurrence: { frequency: 'daily', interval: 0 } },
        { endDate: '2024-01-02' },
      ),
    ).toThrow('Recurrence interval must be a positive integer');

    expect(() =>
      generateCalendarTasks(
        {
          ...baseSchedule,
          recurrence: { frequency: 'weekly', interval: 1, weekdays: [] },
        },
        { endDate: '2024-01-07' },
      ),
    ).toThrow('Weekly recurrence must include weekdays');

    expect(() =>
      generateCalendarTasks(
        {
          ...baseSchedule,
          recurrence: { frequency: 'monthly', interval: 1, monthDays: [0, 32] },
        },
        { endDate: '2024-01-31' },
      ),
    ).toThrow('Monthly recurrence contains invalid days');
  });

  it('throws when end date is before start date', () => {
    expect(() =>
      generateCalendarTasks(baseSchedule, { endDate: '2023-12-31' }),
    ).toThrow('End date must be on or after start date');
  });
});
