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
import { ResponseAnnouncementGetListByQuery } from "@/server/spec/announcement/announcement.responses";
import { Badge } from "@/components/ui/badge";

const AnnouncementTable = ({
  announcementListData,
  searchParams,
}: {
  announcementListData: ResponseAnnouncementGetListByQuery;
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
            <TableRow>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Admin Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Is Displayed On</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcementListData.announcements.map(
              ({ id, adminId, title, isDisplayedOn, createdAt, updatedAt }) => {
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
                            <Link href={`/announcements/${id}`}>Edit</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>{adminId}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={isDisplayedOn ? "success" : "destructive"}
                      >
                        {isDisplayedOn ? "On" : "Off"}
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
            Showing <strong>{announcementListData.announcements.length}</strong>{" "}
            of announcements
          </div>
          <ListPagination
            pagination={announcementListData.pagination}
            searchParams={searchParams}
            routePath="/announcements"
            renderNextPage={
              announcementListData.announcements.length ===
              announcementListData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnnouncementTable;
