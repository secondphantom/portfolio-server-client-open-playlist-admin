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
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { ResponseUserGetById } from "@/server/spec/user/user.responses";
import { ResponseCourseGetById } from "@/server/spec/course/course.responses";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  version: z.number().optional(),
  categoryId: z.number().optional(),
  language: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  summary: z.string().optional(),
  chapters: z
    .array(
      z
        .object({
          title: z.string(),
          time: z.number(),
        })
        .strict()
    )
    .optional(),
  enrollCount: z.number().optional(),
  generatedAi: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  courseData: ResponseCourseGetById;
};

export const CourseIdCard: React.FC<Props> = ({
  courseData: {
    id,
    version,
    videoId,
    channelId,
    categoryId,
    language,
    title,
    titleTsvector,
    description,
    summary,
    chapters,
    enrollCount,
    generatedAi,
    duration,
    extra,
    createdAt,
    updatedAt,
    publishedAt,
  },
}) => {
  const router = useSafeRouter(useRouter);
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version,
      categoryId,
      language,
      title,
      description,
      summary: summary ? summary : "",
      chapters,
      enrollCount,
      generatedAi,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsModalOpen(true);
  };

  const updateUser = async () => {
    try {
      const body = { ...form.getValues() };
      setIsLoading(true);

      const data = (await axios
        .patch(`/api/courses/${id}`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
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
        title={`Are you sure you want to update this user?`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="w-full flex justify-end space-x-2">
          <Button
            variant={"ghost"}
            onClick={async () => {
              await updateUser();
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
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input disabled={true} type="number" defaultValue={id} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
                          step={1}
                          {...form.register("version", {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Video Id</FormLabel>
                  <FormControl>
                    <Input disabled={true} type="text" defaultValue={videoId} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Channel Id</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      type="text"
                      defaultValue={channelId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Id</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          type="number"
                          step={1}
                          {...form.register("categoryId", {
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
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormItem>
                  <FormLabel>Title TsVector</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      type="text"
                      defaultValue={titleTsvector}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isLoading} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isLoading} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enrollCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enroll Count</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          type="number"
                          step={1}
                          {...form.register("enrollCount", {
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
                  name="generatedAi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Generated AI</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            "capitalize",
                            field.value ? "bg-green-200" : "bg-red-200"
                          )}
                          onChange={(e) => {}}
                          onClick={(e) => {
                            form.setValue(
                              "generatedAi",
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
                <FormItem>
                  <FormLabel>Published At</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      type="datetime-local"
                      defaultValue={getLocalDateTimeInputValue(
                        new Date(publishedAt)
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <div className="flex">
                <Button disabled={isLoading} type="submit" className="w-full">
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
