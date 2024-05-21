import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { Metadata } from "next";
import { DatabaseBackupScheduleCreateCard } from "../_components/database-backup-schedule-create-card";

export const metadata: Metadata = {
  title: "Schedules Create",
};

const Page = async ({ params }: { params: any }) => {
  return (
    <div className="space-y-2">
      <div className="pl-2 pb-2">
        <PageBreadcrumb
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cron Job" },
            { label: "Database Backup" },
            { label: "Schedules", href: "/cron/database/backup/schedules" },
            { label: "Create" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1">
        <DatabaseBackupScheduleCreateCard />
      </div>
    </div>
  );
};

export default Page;
