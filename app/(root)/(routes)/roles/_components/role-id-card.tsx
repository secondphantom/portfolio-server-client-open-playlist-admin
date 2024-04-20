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
import { getLocalDateTimeInputValue } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useSafeRouter } from "@/hooks/use-safe-router";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { ResponseRoleGetById } from "@/server/spec/role/role.responses";

const formSchema = z.object({
  name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  roleData: ResponseRoleGetById;
};

export const RoleIdCard: React.FC<Props> = ({
  roleData: { id, name, createdAt, updatedAt },
}) => {
  const router = useSafeRouter(useRouter);
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
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
        .patch(`/api/roles/${id}`, body)
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

  const deleteUser = async () => {
    try {
      setIsLoading(true);
      const data = (await axios
        .delete(`/api/roles/${id}`)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        router.push("/roles");
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
              await updateUser();
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
              await deleteUser();
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
          <CardTitle>Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>id</FormLabel>
                  <FormControl>
                    <Input disabled={true} type="text" defaultValue={id} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} type="text" />
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
