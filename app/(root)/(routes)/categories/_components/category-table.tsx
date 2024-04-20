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
import { ResponseRoleGetListByQuery } from "@/server/spec/role/role.responses";
import { ResponseCategoryGetListByQuery } from "@/server/spec/category/category.responses";

const CategoryTable = ({
  categoryListData,
  searchParams,
}: {
  categoryListData: ResponseCategoryGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Parent Id</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryListData.categories.map(
              ({ id, name, parentId, createdAt, updatedAt }) => {
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
                            <Link href={`/categories/${id}`}>Edit</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{parentId}</TableCell>
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
            Showing <strong>{categoryListData.categories.length}</strong> of
            categories
          </div>
          <ListPagination
            pagination={categoryListData.pagination}
            searchParams={searchParams}
            routePath="/categories"
            renderNextPage={
              categoryListData.categories.length ===
              categoryListData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CategoryTable;
