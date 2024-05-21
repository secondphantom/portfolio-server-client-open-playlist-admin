import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { DatabaseBackupScheduleIdCard } from "../_components/database-backup-schedule-id-card";
import { Metadata } from "next";
import { ResponseDatabaseBackupScheduleGetById } from "@/server/spec/databaseBackup/database.backup.responses";

export const metadata: Metadata = {
  title: "Schedules",
};

const getPageData = async (params: any) => {
  const databaseBackupScheduleData = await fetch(
    `${process.env.API_SERVER_HOST}/api/database/backup/schedules/${params.id}`,
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

      return body as ResponseBody<ResponseDatabaseBackupScheduleGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { databaseBackupScheduleData };
};

const Page = async ({ params }: { params: any }) => {
  const { databaseBackupScheduleData } = await getPageData(params);

  if (!databaseBackupScheduleData.data) {
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
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <DatabaseBackupScheduleIdCard data={databaseBackupScheduleData.data} />
      </div>
    </div>
  );
};

export default Page;
