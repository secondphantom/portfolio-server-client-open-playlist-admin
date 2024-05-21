"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoadingModalStore } from "@/hooks/use-loading-modal-store";
import { Button } from "@/components/ui/button";
import { cn, getLocalDateTimeInputValue } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useSafeRouter } from "@/hooks/use-safe-router";
import { useRouter } from "next-nprogress-bar";
import { Modal } from "@/components/ui/modal";
import { ResponseDatabaseBackupScheduleGetById } from "@/server/spec/databaseBackup/database.backup.responses";

const formSchema = z.object({
  title: z.string(),
  interval: z.number(),
  startAt: z.string(),
  isActive: z.boolean(),
  isLocked: z.boolean(),
  type: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  data: ResponseDatabaseBackupScheduleGetById;
};

export const DatabaseBackupScheduleIdCard: React.FC<Props> = ({
  data: {
    id,
    title,
    interval,
    startAt,
    type,
    isActive,
    isLocked,
    createdAt,
    updatedAt,
  },
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      interval,
      startAt: startAt as any as string,
      isActive,
      isLocked,
      type,
    },
  });

  useEffect(() => {
    let intervalType = "";
    switch (interval) {
      case 60 * 60:
        intervalType = "hour";
        break;
      case 24 * 60 * 60:
        intervalType = "day";
        break;
      case 24 * 60 * 60 * 7:
        intervalType = "week";
        break;
      case 24 * 60 * 60 * 7 * 30:
        intervalType = "month";
        break;
      case 24 * 60 * 60 * 7 * 30 * 365:
        intervalType = "year";
        break;

      default:
        break;
    }

    setIntervalType(intervalType);
  }, []);

  useEffect(() => {
    let interval = 0;

    switch (intervalType) {
      case "hour":
        interval = 60 * 60;
        break;
      case "day":
        interval = 24 * 60 * 60;
        break;
      case "week":
        interval = 24 * 60 * 60 * 7;
        break;
      case "month":
        interval = 24 * 60 * 60 * 7 * 30;
        break;
      case "year":
        interval = 24 * 60 * 60 * 7 * 30 * 365;
        break;

      default:
        return;
        break;
    }

    form.setValue("interval", interval);
  }, [intervalType]);

  const onSubmit = async (values: FormValues) => {
    setIsModalOpen(true);
  };

  const updateItem = async () => {
    try {
      const body = { ...form.getValues() };
      setIsLoading(true);

      const data = (await axios
        .patch(`/api/cron/database-backup/schedules/${id}`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        toast.success("success updated");
        router.refresh();
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

  const deleteItem = async () => {
    try {
      setIsLoading(true);
      const data = (await axios
        .delete(`/api/cron/database-backup/schedules/${id}`)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        router.push("/cron/database-backup/schedules");
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
        title={`Are you sure you want to update this?`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="w-full flex justify-end space-x-2">
          <Button
            variant={"ghost"}
            onClick={async () => {
              await updateItem();
              setIsModalOpen(false);
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      </Modal>
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
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input disabled={true} type="text" defaultValue={id} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval (sec.)</FormLabel>
                      <div className="p-1 bg-secondary w-fit rounded-sm">
                        {["hour", "day", "week", "month", "year"].map(
                          (type, index) => {
                            return (
                              <Button
                                key={type}
                                variant={
                                  intervalType === type ? "default" : "ghost"
                                }
                                size={"sm"}
                                type="button"
                                onClick={() => setIntervalType(type)}
                              >
                                {type}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          {...field}
                          type="number"
                          step={1}
                          {...form.register("interval", {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start At</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="datetime-local"
                          defaultValue={getLocalDateTimeInputValue(
                            new Date(startAt)
                          )}
                          onChange={(e) => {
                            form.setValue(
                              "startAt",
                              new Date(e.target.value).toISOString()
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Active</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            "capitalize",
                            field.value ? "bg-green-200" : "bg-red-200"
                          )}
                          onChange={(e) => {}}
                          onClick={(e) => {
                            form.setValue(
                              "isActive",
                              e.currentTarget.value.toLocaleLowerCase() ===
                                "true"
                                ? false
                                : true
                            );
                          }}
                          value={`${field.value}`}
                          disabled={isLoading}
                          type="button"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isLocked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Locked</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            "capitalize",
                            field.value ? "bg-green-200" : "bg-red-200"
                          )}
                          onChange={(e) => {}}
                          onClick={(e) => {
                            form.setValue(
                              "isLocked",
                              e.currentTarget.value.toLocaleLowerCase() ===
                                "true"
                                ? false
                                : true
                            );
                          }}
                          value={`${field.value}`}
                          disabled={isLoading}
                          type="button"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input disabled={true} type="text" defaultValue={type} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              </div>
              <div className="flex space-x-1">
                <Button disabled={isLoading} type="submit" className="w-full">
                  Update
                </Button>
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
