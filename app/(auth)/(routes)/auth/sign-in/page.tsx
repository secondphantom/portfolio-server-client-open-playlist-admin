import { RouterIndex } from "@/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { SignInForm } from "../_components/sign-in-form";

const Page = async () => {
  return (
    <div className="w-full justify-center flex">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] h-dvh">
        <SignInForm />
      </div>
    </div>
  );
};

export default Page;
