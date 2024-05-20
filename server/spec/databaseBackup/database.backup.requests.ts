export type RequestDatabaseBackupScheduleCreate = {
  title: string;
  interval: number;
  startAt: Date;
  type: "full";
};

export type RequestDatabaseBackupScheduleGetById = {
  id: number;
};

export type RequestDatabaseBackupScheduleGetListByQuery = {
  page?: number;
  order?: "recent" | "old";
  isActive?: string;
  isLocked?: string;
};

export type RequestDatabaseBackupScheduleUpdateById = {
  id: number;
  title?: string;
  interval?: number;
  startAt?: Date;
  isActive?: boolean;
  isLocked?: boolean;
};

export type RequestDatabaseBackupScheduleDeleteById = {
  id: number;
};

export type RequestDatabaseBackupJobGetListByQuery = {
  page?: number;
  order?: "recent" | "old";
};

export type RequestDatabaseBackupJobGetById = {
  id: number;
};

export type RequestDatabaseBackupJobCreate = {
  title?: string;
};
