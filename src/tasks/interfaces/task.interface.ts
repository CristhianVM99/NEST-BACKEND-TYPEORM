export enum taskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface ITask {
  title: string;
  description: string;
  dueDate: Date;
  status: taskStatus;
}
