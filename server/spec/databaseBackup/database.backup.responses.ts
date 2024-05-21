export type ResponseDatabaseBackupScheduleGetById = {
  id: number;
  title: string;
  interval: number;
  startAt: Date;
  type: string;
  isActive: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ResponseDatabaseBackupScheduleGetListByQuery = {
  schedules: {
    id: number;
    title: string;
    interval: number;
    startAt: Date;
    type: string;
    isActive: boolean;
    isLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseDatabaseBackupJobGetListByQuery = {
  jobs: {
    id: number;
    uuid: string;
    title: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
  };
};

export type ResponseDatabaseBackupJobGetById = {
  id: number;
  uuid: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
