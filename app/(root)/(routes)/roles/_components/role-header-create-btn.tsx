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
import toast from "react-hot-toast";

const formSchema = z.object({
  id: z.number(),
  name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const RoleHeaderCreateBtn = () => {
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
      id: 0,
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const body = { ...values };
      setIsLoading(true);
      const data = (await axios
        .post(`/api/roles`, body)
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
        title="Create New Role"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        type="number"
                        step={1}
                        {...form.register("id", {
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
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
        className=" gap-1"
        onClick={() => {
          form.reset();
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
