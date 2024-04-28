"use client";
import z from "zod";
import { useRouter } from "next-nprogress-bar";
import { SearchIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSafeRouter } from "@/hooks/use-safe-router";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .email("This is not a valid email."),
});

export const UserEmailSearchBar = () => {
  const router = useSafeRouter(useRouter);

  const onSubmit = async (input: string) => {
    if (input === "") {
      router.safePush("/users");
      return;
    }
    try {
      const validInput = formSchema.parse({
        email: input.replaceAll("\t", ""),
      });
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("email", validInput.email);
      router.safePush(`/users?${newSearchParams.toString()}`);
    } catch (error: any) {
      console.log(error);
      let message = "Something wrong";
      try {
        message = JSON.parse(error.message)[0].message;
      } catch (error) {}
      toast.error(message, { duration: 700 });
    }
  };

  return (
    <div className="flex w-full space-x-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.currentTarget.elements[0] as HTMLInputElement).value;

          onSubmit(input);
        }}
        className="flex space-x-1 w-full"
      >
        <div className="">
          <Input
            placeholder="example@email.com"
            type="search"
            className=""
            name="email"
          />
        </div>
        <Button type="submit" className="">
          <SearchIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
