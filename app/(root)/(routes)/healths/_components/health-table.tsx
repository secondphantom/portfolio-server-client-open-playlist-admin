import { MoreHorizontal } from "lucide-react";

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

import { ResponseHealthGetListByQuery } from "@/server/spec/health/health.responses";
import Link from "next/link";

const HealthTable = ({
  healthListData,
  searchParams,
}: {
  healthListData: ResponseHealthGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Healths</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthListData.healths.map(({ id, version, data, createdAt }) => {
              const cloneData = structuredClone(data);
              const apiStatus = cloneData.apis.sort((a, b) => {
                return b.status - a.status;
              })[0].status;
              return (
                <TableRow key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{version}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <div>API</div>
                      <Badge
                        variant={apiStatus === 200 ? "outline" : "destructive"}
                      >
                        {apiStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      {new Date(createdAt).toLocaleString()}
                      {new Date(createdAt).getTime() >=
                        new Date().getTime() - 24 * 60 * 60 * 1000 && (
                        <Badge className="ml-2" variant={"new"}>
                          New
                        </Badge>
                      )}
                    </div>
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
                          <Link href={`/healths/${id}`}>Show Detail</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col mx-auto space-y-2">
          <div className="text-xs text-muted-foreground mx-auto">
            Showing <strong>{healthListData.healths.length}</strong> of healths
          </div>
          <ListPagination
            pagination={healthListData.pagination}
            searchParams={searchParams}
            routePath="/healths"
            renderNextPage={
              healthListData.healths.length ===
              healthListData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default HealthTable;
