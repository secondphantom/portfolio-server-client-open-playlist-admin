import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ResponseBody } from "@/types/response.type";

import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { ResponseDatabaseBackupJobGetListByQuery } from "@/server/spec/databaseBackup/database.backup.responses";

import DatabaseBackupJobTable from "./_components/database-backup-job-table";
import { DatabaseBackupJobHeader } from "./_components/database-backup-job-header";

export const metadata: Metadata = {
  title: "Database Backup Jobs",
};

const getPageData = async (searchParams: any) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const databaseBackupJobListData = await fetch(
    `${
      process.env.API_SERVER_HOST
    }/api/cron/database-backup/jobs?${urlSearchParams.toString()}`,
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
      return body as ResponseBody<ResponseDatabaseBackupJobGetListByQuery>;
    })
    .catch(() => ({ success: false, data: undefined }));
  return { databaseBackupJobListData };
};

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { databaseBackupJobListData } = await getPageData(searchParams as any);

  if (!databaseBackupJobListData.data) {
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
          ]}
        />
      </div>
      <div className="pb-2 flex w-full justify-end">
        <DatabaseBackupJobHeader />
      </div>
      <DatabaseBackupJobTable
        searchParams={searchParams}
        listData={databaseBackupJobListData.data}
      />
    </div>
  );
};

export default Page;
