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
import { ResponseCourseGetListByQuery } from "@/server/spec/course/course.responses";

const CourseTable = ({
  courseListData,
  searchParams,
}: {
  courseListData: ResponseCourseGetListByQuery;
  searchParams: any;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Video Id</TableHead>
              <TableHead>Channel Id</TableHead>
              <TableHead>Category Id</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Enroll Count</TableHead>
              <TableHead>Generated AI</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Published At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseListData.courses.map(
              ({
                id,
                version,
                videoId,
                channelId,
                categoryId,
                language,
                title,
                enrollCount,
                generatedAi,
                duration,
                createdAt,
                updatedAt,
                publishedAt,
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
                            <Link href={`/courses/${id}`}>Edit</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>{version}</TableCell>
                    <TableCell>{videoId}</TableCell>
                    <TableCell>{channelId}</TableCell>
                    <TableCell>{categoryId}</TableCell>
                    <TableCell>{language}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>{enrollCount}</TableCell>
                    <TableCell>
                      <Badge variant={generatedAi ? "success" : "destructive"}>
                        {generatedAi ? "True" : "False"}
                      </Badge>
                    </TableCell>
                    <TableCell>{duration}</TableCell>

                    <TableCell className="text-sm">
                      {new Date(createdAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(updatedAt).toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(publishedAt).toLocaleString("en-US")}
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
            Showing <strong>{courseListData.courses.length}</strong> of courses
          </div>
          <ListPagination
            pagination={courseListData.pagination}
            searchParams={searchParams}
            routePath="/courses"
            renderNextPage={
              courseListData.courses.length ===
              courseListData.pagination.pageSize
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseTable;
