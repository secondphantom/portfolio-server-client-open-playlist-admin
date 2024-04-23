"use client";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoadingModalStore } from "@/hooks/use-loading-modal-store";
import { Button } from "@/components/ui/button";
import { cn, getLocalDateTimeInputValue } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useSafeRouter } from "@/hooks/use-safe-router";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { ResponseSessionsGetById } from "@/server/spec/session/session.responses";
import { Label } from "@/components/ui/label";

type Props = {
  sessionData: ResponseSessionsGetById;
};

export const SessionIdCard: React.FC<Props> = ({
  sessionData: { id, data, createdAt, updatedAt, isCurrent },
}) => {
  const router = useSafeRouter(useRouter);
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const deleteItem = async () => {
    try {
      setIsLoading(true);
      const data = (await axios
        .delete(`/api/sessions/${id}`)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        router.push("/account/sessions");
      }
    } catch (error: any) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data && data.message) {
          message = data.message;
        }
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={`Are you sure you want to delete this?`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="w-full flex justify-end space-x-2">
          <Button
            variant={"destructive"}
            onClick={async () => {
              await deleteItem();
              setIsDeleteModalOpen(false);
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Close</Button>
        </div>
      </Modal>
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
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
                <Label className="pl-2">Current Device</Label>
                <Input
                  className={cn(
                    "capitalize disabled:opacity-100",
                    isCurrent ? "bg-green-200" : "bg-red-200"
                  )}
                  disabled={true}
                  type="text"
                  defaultValue={`${isCurrent}`}
                />
              </div>
              {data.ip && (
                <div className="space-y-1">
                  <Label className="pl-2">ip</Label>
                  <Input
                    disabled={true}
                    type="text"
                    defaultValue={data.ip}
                    className="disabled:opacity-100"
                  />
                </div>
              )}
              {data.userAgent && (
                <div className="space-y-1">
                  <Label className="pl-2">userAgent</Label>
                  <Input
                    disabled={true}
                    type="text"
                    defaultValue={data.userAgent}
                    className="disabled:opacity-100"
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label className="pl-2">Updated At</Label>
                <Input
                  disabled={true}
                  type="datetime-local"
                  defaultValue={getLocalDateTimeInputValue(new Date(updatedAt))}
                  className="disabled:opacity-100"
                />
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
            </div>
            <div className="flex space-x-1">
              <Button
                disabled={isLoading}
                className="w-full"
                variant={"destructive"}
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
