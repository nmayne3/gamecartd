"use client";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import Button from "../button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export default function SignIn() {
  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: data.email,
      password: data.password,
    });
    if (res && res.error) {
      form.setError("root", {
        type: "custom",
        message: "Wrong email or password. Try again or create a new account.",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div>
        <label htmlFor="email" className="font-semibold">
          {" "}
          Email{" "}
        </label>
        <Input
          id="email"
          type="text"
          className="!bg-[#cde] focus-within:!bg-white"
          placeholder="example@email.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <small className="text-red-500 max-w-full">
            {" "}
            {form.formState.errors.email.message}{" "}
          </small>
        )}
      </div>
      <div>
        <label className="font-semibold" htmlFor="password">
          {" "}
          Password{" "}
        </label>
        <Input
          className="!bg-[#cde] focus-within:!bg-white"
          id="password"
          type="password"
          placeholder="Password"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <small className="text-red-500 max-w-full">
            {" "}
            {form.formState.errors.password.message}{" "}
          </small>
        )}
      </div>
      {form.formState.errors.root && (
        <small className="text-red-500 max-w-full">
          {" "}
          {form.formState.errors.root.message}{" "}
        </small>
      )}

      <button type="submit" className={"button !bg-accent-green !text-white"}>
        {" "}
        Sign In{" "}
      </button>
    </form>
  );
}
