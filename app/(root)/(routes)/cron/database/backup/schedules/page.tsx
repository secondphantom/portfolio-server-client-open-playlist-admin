import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";

import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { ResponseDatabaseBackupScheduleGetListByQuery } from "@/server/spec/databaseBackup/database.backup.responses";

import DatabaseBackupScheduleTable from "./_components/database-backup-schedule-table";
import { DatabaseBackupScheduleHeader } from "./_components/database-backup-schedule-header";

export const metadata: Metadata = {
  title: "Database Backup Schedules",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const databaseBackupScheduleListData = await fetch(
    `${
      process.env.API_SERVER_HOST
    }/api/database/backup/schedules?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  )
    .then(async (res) => {
      if (res.status >= 300) throw new Error();
      const body = await res.json();
      return body as ResponseBody<ResponseDatabaseBackupScheduleGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { databaseBackupScheduleListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { databaseBackupScheduleListData } = await getPageData(
    searchParams as any
  );

  if (!databaseBackupScheduleListData.data) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cron Job" },
            { label: "Database Backup" },
            { label: "Schedules", href: "/cron/database/backup/schedules" },
          ]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <DatabaseBackupScheduleHeader />
      </div>
      <DatabaseBackupScheduleTable
        searchParams={searchParams}
        listData={databaseBackupScheduleListData.data}
      />
    </div>
  );
};

export default Page;
