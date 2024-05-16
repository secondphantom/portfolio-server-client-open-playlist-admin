interface DatabaseBackupUtil {
  dumpToFile: (filePath: string) => Promise<void>;
}
