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
import { ResponseDatabaseBackupScheduleGetListByQuery } from "@/server/spec/databaseBackup/database.backup.responses";

const DatabaseBackupScheduleTable = ({
  listData,
  searchParams,
}: {
  listData: ResponseDatabaseBackupScheduleGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="capitalize">
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>id</TableHead>
              <TableHead>title</TableHead>
              <TableHead>interval</TableHead>
              <TableHead>start at</TableHead>
              <TableHead>type</TableHead>
              <TableHead>isActive</TableHead>
              <TableHead>isLocked</TableHead>
              <TableHead>created at</TableHead>
              <TableHead>updated at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listData.schedules.map(
              ({
                id,
                title,
                interval,
                startAt,
                type,
                isActive,
                isLocked,
                createdAt,
                updatedAt,
              }) => {
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
                            <Link
                              href={`/cron/database-backup/schedules/${id}`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>{interval}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(startAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isActive ? "success" : "destructive"}>
                        {isActive ? "On" : "Off"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isLocked ? "success" : "destructive"}>
                        {isLocked ? "On" : "Off"}
                      </Badge>
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
            Showing <strong>{listData.schedules.length}</strong> of schedules
          </div>
          <ListPagination
            pagination={listData.pagination}
            searchParams={searchParams}
            routePath="/cron/database-backup/schedules"
            renderNextPage={
              listData.schedules.length === listData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatabaseBackupScheduleTable;
