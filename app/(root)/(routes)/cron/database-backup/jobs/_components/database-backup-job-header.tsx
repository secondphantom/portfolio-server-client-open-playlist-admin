import { DatabaseBackupJobHeaderOrderCombobox } from "./database-backup-job-header-order-combobox";
import { DatabaseBackupJobHeaderCreateBtn } from "./database-backup-job-create-btn";

export const DatabaseBackupJobHeader: React.FC<{}> = () => {
  return (
    <div className="flex items-end w-full flex-row space-x-2 flex-wrap">
      <div className="flex items-center space-x-2">
        <DatabaseBackupJobHeaderOrderCombobox />
      </div>
      <div className="flex space-x-2">
        <DatabaseBackupJobHeaderCreateBtn />
      </div>
    </div>
  );
};
