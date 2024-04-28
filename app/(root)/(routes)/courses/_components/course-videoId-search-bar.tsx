"use client";
import z from "zod";
import { useRouter } from "next-nprogress-bar";
import { SearchIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSafeRouter } from "@/hooks/use-safe-router";

const formSchema = z.object({
  videoId: z.string(),
});

export const CourseVideoIdSearchBar = () => {
  const router = useSafeRouter(useRouter);

  const onSubmit = async (input: string) => {
    if (input === "") {
      router.safePush("/courses");
      return;
    }
    try {
      const validInput = formSchema.parse({
        videoId: input.replaceAll("\t", ""),
      });
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("videoId", validInput.videoId);
      router.safePush(`/courses?${newSearchParams.toString()}`);
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
            placeholder="videoId"
            type="search"
            className=""
            name="videoId"
          />
        </div>
        <Button type="submit" className="">
          <SearchIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
