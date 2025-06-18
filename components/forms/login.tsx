"use client";
import React from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SwitchIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(4, { message: "" }),
});

function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      queryClient.setQueryData(["userData"], data);
    },
    onError: (error) => {
      form.setError("root", {
        type: "validate",
        message: "Email ou senha são invalidos",
      });
    },
  });

  async function loginUser(credentials: { email: string; password: string }) {
    const response = await fetch("http://localhost:5000/auth", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full flex  items-center justify-between">
                  Senha{" "}
                  <Button variant={"link"} type="button" asChild>
                    <a href="/password-recovery">Esqueci minha senha</a>
                  </Button>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
      {form.formState.errors.root ? (
        <p className="text-red-600 text-sm p-1">
          {form.formState.errors.root.message}
        </p>
      ) : (
        ""
      )}

      <Separator className="my-2" />
      <div className="w-full flex items-center justify-center">
        <p className="text-sm ">
          {" "}
          Ainda não tem uma conta ?{" "}
          <Link
            href={"/singup"}
            className="font-semibold  cursor-pointer border-b border-black py-1"
          >
            Crie uma aqui.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
