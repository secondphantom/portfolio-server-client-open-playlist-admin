import { ResponseHealthGetById } from "@/server/spec/health/health.responses";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const HealthIdApiTable = ({
  healthData,
}: {
  healthData: ResponseHealthGetById;
}) => {
  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>APIs</CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span>{`created at: ${new Date(
              healthData.createdAt
            ).toLocaleString()}`}</span>
            <span>{`version: ${healthData.version}`}</span>
            <span>{`id: ${healthData.version}`}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Response time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthData.data.apis.map(
              ({ method, path, responseTime, status }, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{method}</TableCell>
                    <TableCell>{path}</TableCell>
                    <TableCell>{responseTime} ms</TableCell>
                    <TableCell>
                      <Badge
                        variant={status === 200 ? "outline" : "destructive"}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HealthIdApiTable;
