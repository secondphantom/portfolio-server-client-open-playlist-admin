"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";

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
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  isDisplayedOn: z.boolean(),
  displayStartDate: z.string(),
  displayEndDate: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const NoticeCreateCard: React.FC = () => {
  const router = useSafeRouter(useRouter);
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      isDisplayedOn: false,
      displayStartDate: new Date().toISOString(),
      displayEndDate: new Date().toISOString(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsModalOpen(true);
  };

  const createItem = async () => {
    try {
      const body = { ...form.getValues() };
      setIsLoading(true);

      const data = (await axios
        .post(`/api/notices`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        router.push("/notices");
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Modal
        title={`Are you sure you want to update this?`}
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
          <CardTitle>Course</CardTitle>
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          onChange={(e) => {
                            form.setValue("content", e.target.value);
                            setPreview(e.target.value);
                          }}
                          rows={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDisplayedOn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Displayed On</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            "capitalize",
                            field.value ? "bg-green-200" : "bg-red-200"
                          )}
                          onChange={(e) => {}}
                          onClick={(e) => {
                            form.setValue(
                              "isDisplayedOn",
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
                  name="displayStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Start Date</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="datetime-local"
                          defaultValue={getLocalDateTimeInputValue(
                            new Date(field.value)
                          )}
                          onChange={(e) => {
                            form.setValue(
                              "displayStartDate",
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
                  name="displayEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display End Date</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          type="datetime-local"
                          defaultValue={getLocalDateTimeInputValue(
                            new Date(field.value)
                          )}
                          onChange={(e) => {
                            form.setValue(
                              "displayEndDate",
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
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown className="prose">{preview}</Markdown>
        </CardContent>
      </Card>
    </div>
  );
};
