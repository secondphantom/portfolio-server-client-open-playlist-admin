"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ResponseAdminGetById } from "@/server/spec/admin/admin.response";

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

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .email("This is not a valid email.")
    .optional(),
  roleId: z.number().optional(),
  profileName: z.string().optional(),
  profileImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  adminData: ResponseAdminGetById;
};

export const AdminIdCard: React.FC<Props> = ({
  adminData: {
    id,
    email,
    roleId,
    profileName,
    profileImage,
    createdAt,
    updatedAt,
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
      email,
      roleId,
      profileName,
      profileImage: profileImage || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const body = { ...values };
      setIsLoading(true);
      const data = (await axios
        .patch(`/api/admins/${id}`, body)
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

  const deleteAdmin = async () => {
    try {
      setIsLoading(true);
      const data = (await axios
        .delete(`/api/admins/${id}`)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        await router.push("/admins");
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
        title={`Are you sure you want to delete this admin?`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="w-full flex justify-end space-x-2">
          <Button
            variant={"destructive"}
            onClick={async () => {
              await deleteAdmin();
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
          <CardTitle>Admin Profile</CardTitle>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Id</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
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
                    setIsModalOpen(true);
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
