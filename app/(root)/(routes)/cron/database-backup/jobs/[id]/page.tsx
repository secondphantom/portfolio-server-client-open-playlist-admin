import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

import { Metadata } from "next";
import { ResponseDatabaseBackupJobGetById } from "@/server/spec/databaseBackup/database.backup.responses";
import { DatabaseBackupJobIdCard } from "../_components/database-backup-job-id-card";

export const metadata: Metadata = {
  title: "Jobs",
};

const getPageData = async (params: any) => {
  const databaseBackupJobData = await fetch(
    `${process.env.API_SERVER_HOST}/api/cron/database-backup/jobs/${params.id}`,
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

      return body as ResponseBody<ResponseDatabaseBackupJobGetById>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { databaseBackupJobData };
};

const Page = async ({ params }: { params: any }) => {
  const { databaseBackupJobData } = await getPageData(params);

  if (!databaseBackupJobData.data) {
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
            { label: "Jobs", href: "/cron/database-backup/jobs" },
            { label: params.id },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <DatabaseBackupJobIdCard data={databaseBackupJobData.data} />
      </div>
    </div>
  );
};

export default Page;
