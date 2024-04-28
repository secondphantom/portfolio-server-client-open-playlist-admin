"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { useLoadingModalStore } from "@/hooks/use-loading-modal-store";
import { useSafeRouter } from "@/hooks/use-safe-router";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import toast from "react-hot-toast";

const formSchema = z.object({
  version: z.number(),
  eventAt: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const UserStatsHeaderCreateBtn = () => {
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const router = useSafeRouter(useRouter);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: 1,
      eventAt: new Date().toISOString(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const body = { ...values };
      setIsLoading(true);
      const data = (await axios
        .post(`/api/stats/users`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        setIsModalOpen(false);
        form.reset();
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

  return (
    <>
      <Modal
        title="New Admin"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        type="number"
                        {...form.register("version", {
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
                name="eventAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event at</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        defaultValue={new Date(field.value)
                          .toISOString()
                          .substring(0, 16)}
                        type="datetime-local"
                        onChange={(e) => {
                          form.setValue(
                            "eventAt",
                            new Date(e.target.value).toISOString()
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-1">
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <div className="pr-1">
                    <Spinner size={"default"} />
                  </div>
                )}
                Create
              </Button>
              <Button
                disabled={isLoading}
                className="w-full"
                variant={"ghost"}
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                {isLoading && (
                  <div className="pr-1">
                    <Spinner size={"default"} />
                  </div>
                )}
                Close
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <Button
        className=" gap-1"
        onClick={() => {
          form.reset();
          setIsModalOpen(true);
        }}
        disabled={isLoading}
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="">Create</span>
      </Button>
    </>
  );
};
