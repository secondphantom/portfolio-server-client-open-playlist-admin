import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListPagination } from "@/components/list-pagination";
import { Badge } from "@/components/ui/badge";
import { ResponseDatabaseBackupJobGetListByQuery } from "@/server/spec/databaseBackup/database.backup.responses";

const DatabaseBackupJobTable = ({
  listData,
  searchParams,
}: {
  listData: ResponseDatabaseBackupJobGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="capitalize">
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>id</TableHead>
              <TableHead>uuid</TableHead>
              <TableHead>title</TableHead>
              <TableHead>status</TableHead>
              <TableHead>created at</TableHead>
              <TableHead>updated at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listData.jobs.map(
              ({ id, uuid, title, status, createdAt, updatedAt }) => {
                let statusBadgeType = "default";

                switch (status) {
                  case "success":
                    statusBadgeType = "success";
                    break;
                  case "fail":
                    statusBadgeType = "fail";
                    break;
                }

                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/cron/database-backup/jobs/${id}`}>
                              Detail
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>{uuid}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeType as any}>{status}</Badge>
                    </TableCell>

                    <TableCell className="text-sm">
                      {new Date(createdAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(updatedAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col mx-auto space-y-2">
          <div className="text-xs text-muted-foreground mx-auto">
            Showing <strong>{listData.jobs.length}</strong> of jobs
          </div>
          <ListPagination
            pagination={listData.pagination}
            searchParams={searchParams}
            routePath="/cron/database-backup/jobs"
            renderNextPage={
              listData.jobs.length === listData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatabaseBackupJobTable;
