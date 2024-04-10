import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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

import { ResponseAdminGetListByQuery } from "@/server/spec/admin/admin.response";

const AdminTable = ({
  adminListData,
  searchParams,
}: {
  adminListData: ResponseAdminGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Admins</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role Id</TableHead>
              <TableHead>Profile Name</TableHead>
              <TableHead>Profile Image</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminListData.admins.map(
              ({
                id,
                email,
                roleId,
                profileName,
                profileImage,
                createdAt,
                updatedAt,
              }) => {
                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{roleId}</TableCell>
                    <TableCell>{profileName}</TableCell>
                    <TableCell>{profileImage}</TableCell>
                    <TableCell>
                      {new Date(createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admins/${id}`}>Edit</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
            Showing <strong>{adminListData.admins.length}</strong> of healths
          </div>
          <ListPagination
            pagination={adminListData.pagination}
            searchParams={searchParams}
            routePath="/admins"
            renderNextPage={
              adminListData.admins.length === adminListData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminTable;
