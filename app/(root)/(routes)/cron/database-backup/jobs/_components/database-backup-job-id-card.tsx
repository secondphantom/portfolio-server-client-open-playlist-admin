"use client";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoadingModalStore } from "@/hooks/use-loading-modal-store";
import { Button } from "@/components/ui/button";
import { useSafeRouter } from "@/hooks/use-safe-router";
import { useRouter } from "next-nprogress-bar";
import { Modal } from "@/components/ui/modal";
import { ResponseDatabaseBackupJobGetById } from "@/server/spec/databaseBackup/database.backup.responses";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLocalDateTimeInputValue } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Props = {
  data: ResponseDatabaseBackupJobGetById;
};

export const DatabaseBackupJobIdCard: React.FC<Props> = ({
  data: { id, uuid, title, status, createdAt, updatedAt },
}) => {
  const router = useSafeRouter(useRouter);
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [intervalType, setIntervalType] = useState<string | undefined>();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="pl-2">Id</Label>
                <Input
                  disabled={true}
                  type="text"
                  defaultValue={id}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-1">
                <Label className="pl-2">UUID</Label>
                <Input
                  disabled={true}
                  type="text"
                  defaultValue={uuid}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-1">
                <Label className="pl-2">Title</Label>
                <Input
                  disabled={true}
                  type="text"
                  defaultValue={title}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-1 flex flex-col">
                <Label className="pl-2">Status</Label>
                <div>
                  <Badge variant={statusBadgeType as any}>{status}</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="pl-2">Created At</Label>
                <Input
                  disabled={true}
                  type="datetime-local"
                  defaultValue={getLocalDateTimeInputValue(new Date(createdAt))}
                  className="disabled:opacity-100"
                />
              </div>
              <div className="space-y-1">
                <Label className="pl-2">Updated At</Label>
                <Input
                  disabled={true}
                  type="datetime-local"
                  defaultValue={getLocalDateTimeInputValue(new Date(updatedAt))}
                  className="disabled:opacity-100"
                />
              </div>

              {/* <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input disabled={true} type="text" defaultValue={id} />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Updated At</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    type="datetime-local"
                    defaultValue={getLocalDateTimeInputValue(
                      new Date(createdAt)
                    )}
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Created At</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    type="datetime-local"
                    defaultValue={getLocalDateTimeInputValue(
                      new Date(updatedAt)
                    )}
                  />
                </FormControl>
              </FormItem> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
