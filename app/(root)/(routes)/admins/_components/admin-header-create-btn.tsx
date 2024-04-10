"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import toast from "react-hot-toast";

const createAdminSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .email("This is not a valid email."),
  profileName: z.string().optional(),
});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

export const AdminHeaderCreateBtn = () => {
  const setLoading = useLoadingModalStore((state) => state.setLoading);
  const router = useSafeRouter(useRouter);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createAdminForm = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: CreateAdminFormValues) => {
    try {
      const body = { ...values };
      setIsLoading(true);
      const data = (await axios
        .post(`/api/admins`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        setIsModalOpen(false);
        createAdminForm.reset();
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
        <Form {...createAdminForm}>
          <form
            onSubmit={createAdminForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={createAdminForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="name@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createAdminForm.control}
                name="profileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="name"
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
        size="sm"
        className=" gap-1"
        onClick={() => {
          createAdminForm.reset();
          setIsModalOpen(true);
        }}
        disabled={isLoading}
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Create
        </span>
      </Button>
    </>
  );
};
