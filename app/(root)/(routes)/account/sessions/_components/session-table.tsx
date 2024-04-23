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
import { ResponseSessionGetListByQuery } from "@/server/spec/session/session.responses";

const SessionTable = ({
  sessionListData,
  searchParams,
}: {
  sessionListData: ResponseSessionGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionListData.sessions.map(
              ({ id, isCurrent, createdAt, updatedAt }) => {
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
                            <Link href={`/account/sessions/${id}`}>Edit</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>
                      <Badge variant={isCurrent ? "success" : "destructive"}>
                        {isCurrent ? "True" : "False"}
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
            Showing <strong>{sessionListData.sessions.length}</strong> of
            sessions
          </div>
          <ListPagination
            pagination={sessionListData.pagination}
            searchParams={searchParams}
            routePath="/sessions"
            renderNextPage={
              sessionListData.sessions.length ===
              sessionListData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default SessionTable;
