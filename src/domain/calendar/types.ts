export type CalendarTaskType = 'water' | 'prune' | 'repot' | 'mist' | 'custom';

export type CalendarTaskStatus = 'pending' | 'done' | 'skipped';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type CalendarRecurrence =
  | {
      frequency: 'daily';
      interval: number;
    }
  | {
      frequency: 'weekly';
      interval: number;
      weekdays: Weekday[];
    }
  | {
      frequency: 'monthly';
      interval: number;
      monthDays: number[];
    };

export type CalendarTask = {
  id: string;
  plantId: string;
  plantName: string;
  type: CalendarTaskType;
  title: string;
  dueDate: string;
  status: CalendarTaskStatus;
  recurrence: CalendarRecurrence | null;
  completedAt: string | null;
  notes: string | null;
};

export type CalendarTaskSchedule = {
  plantId: string;
  plantName: string;
  taskType: CalendarTaskType;
  title: string;
  startDate: string;
  recurrence: CalendarRecurrence;
};

export type CalendarTaskGenerationOptions = {
  endDate: string;
  maxTasks?: number;
  status?: CalendarTaskStatus;
};
