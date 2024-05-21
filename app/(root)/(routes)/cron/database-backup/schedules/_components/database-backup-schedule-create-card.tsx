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

const formSchema = z.object({
  title: z.string(),
  interval: z.number(),
  startAt: z.string(),
  type: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const DatabaseBackupScheduleCreateCard: React.FC = () => {
  const router = useSafeRouter(useRouter);
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [intervalType, setIntervalType] = useState<string | undefined>("day");

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      interval: 24 * 60,
      startAt: new Date().toISOString(),
      type: "full",
    },
  });

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

  const createItem = async () => {
    try {
      const body = { ...form.getValues() };
      setIsLoading(true);

      const data = (await axios
        .post(`/api/cron/database-backup/schedules`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        toast.success("success updated");
        router.safePush("/cron/database-backup/schedules");
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
        title={`Are you sure you want to crete this?`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="w-full flex justify-end space-x-2">
          <Button
            variant={"ghost"}
            onClick={async () => {
              await createItem();
              setIsModalOpen(false);
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
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
                        {["day", "week", "month", "year"].map((type, index) => {
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
                        })}
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
                          defaultValue={getLocalDateTimeInputValue(new Date())}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={true} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-1">
                <Button disabled={isLoading} type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
