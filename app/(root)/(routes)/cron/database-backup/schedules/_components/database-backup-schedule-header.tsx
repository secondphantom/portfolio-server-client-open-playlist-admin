import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { DatabaseBackupScheduleHeaderOrderCombobox } from "./database-backup-schedule-header-order-combobox";

export const DatabaseBackupScheduleHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center space-x-2">
        <DatabaseBackupScheduleHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <Button asChild>
          <Link
            href={"/cron/database-backup/schedules/create"}
            className="flex items-center space-x-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
