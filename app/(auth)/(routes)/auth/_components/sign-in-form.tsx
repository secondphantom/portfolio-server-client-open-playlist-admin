"use client";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

import { useSafeRouter } from "@/hooks/use-safe-router";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const EmailFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .email("This is not a valid email."),
});

const OtpFormSchema = z.object({
  otpCode: z.string().length(6),
});

type EmailFormValues = z.infer<typeof EmailFormSchema>;
type OtpFormValues = z.infer<typeof OtpFormSchema>;

type Props = {
  routeHome?: boolean;
};

export const SignInForm: React.FC<Props> = ({ routeHome }) => {
  const router = useSafeRouter(useRouter);

  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signInEmail, setSignInEmail] = useState("");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmitEmail = async (values: EmailFormValues) => {
    try {
      const body = { ...values };
      setIsLoading(true);
      const data = (await axios
        .post(`/api/auth/sign-in`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        setSignInEmail(values.email);
        setIsVerifyingOtp(true);
      }
    } catch (error: any) {
      let message = "Please check your email";
      toast.error(message, { duration: 1000 });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async (values: OtpFormValues) => {
    try {
      const body = { ...values, email: signInEmail };
      setIsLoading(true);
      const data = (await axios
        .post(`/api/auth/sign-in/verify-otp`, body)
        .then((res) => res.data)) as { success: boolean; message: string };
      if (data.success) {
        router.push("/");
      }
    } catch (error: any) {
      let message = "Please check your email";
      toast.error(message, { duration: 1000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      </div>
      <div className={cn("grid gap-6")}>
        {!isVerifyingOtp && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onSubmitEmail)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={emailForm.control}
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
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <div className="pr-1">
                    <Spinner size={"default"} />
                  </div>
                )}
                Send Verification Code
              </Button>
            </form>
          </Form>
        )}

        {isVerifyingOtp && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onSubmitOtp)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={true} type="email" value={signInEmail} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={otpForm.control}
                  name="otpCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl className="bg-red-300">
                        <InputOTP
                          className="bg-red-900"
                          maxLength={6}
                          {...field}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <div className="pr-1">
                    <Spinner size={"default"} />
                  </div>
                )}
                Verify
              </Button>
            </form>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full"
              onClick={() => setIsVerifyingOtp(false)}
            >
              {isLoading && (
                <div className="pr-1">
                  <Spinner size={"default"} />
                </div>
              )}
              Resend Email
            </Button>
          </Form>
        )}
      </div>
    </>
  );
};
