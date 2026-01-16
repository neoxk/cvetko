export type CareEventType = 'water';

export type CareEvent = {
  id: string;
  entryId: string;
  plantId: string;
  type: CareEventType;
  occurredAt: string;
  notes: string | null;
};
