"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import FullPageLoad from "../custom/full-page-load";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(5, { message: "Password needs to be at least 5 characters long." }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "First name can't be empty." }),
  lastName: z.string().min(1, { message: "Last name can't be empty." }),
  estate: z.string(),
  city: z.string(),
  street: z.string(),
  cep: z.string().min(8, {}),
});
function SingupMulti() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      estate: "",
      city: "",
      cep: "",
      street: "",
    },
  });

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [cepLoad, setCepLoad] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword !== values.password) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Senhas não iguais.",
      });
      form.setError("password", {
        type: "manual",
      });
    }

    setLoading(true);
    try {
      const post = await fetch("http://localhost:5000/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          username: `${values.firstName} ${values.lastName}`,
          password: values.password,
          city: values.city,
          street: values.street,
          state: values.estate,
        }),
      });

      if (!post.ok) {
        setLoading(false);

        const data = await post.json();
        console.log(data);
        console.log(values);
      } else {
        router.push("/");
      }
    } catch (err) {
      setLoading(false);

      console.error(err);
    }
  }

  const getUserAdress = async (cep: string) => {
    setCepLoad(true);
    try {
      const adress = await fetch(`http://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
      });

      const data = await adress.json();

      form.setValue("city", data.localidade);
      form.setValue("street", data.bairro);
      form.setValue("estate", data.estado);
      setCepLoad(false);
    } catch (err) {
      console.error(err);
      setCepLoad(false);
    }
  };

  const x = form.watch("cep");

  useEffect(() => {
    if (x.length === 8) {
      getUserAdress(x);
    }
  }, [x]);

  return (
    <div className="w-full flex items-center justify-center">
      {isLoading ? (
        <FullPageLoad />
      ) : (
        <div className=" w-full space-y-7">
          <Form {...form}>
            <h2 className=" text-muted-foreground font-semibold">
              Dados de login
            </h2>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
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
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="password" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Confirme sua senha</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="password" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-7">
                <h2 className="text-muted-foreground font-semibold">
                  {" "}
                  Informações pessoais
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>

                        <FormControl>
                          <Input placeholder="" {...field} className="" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            disabled={cepLoad}
                            maxLength={8}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="my-3"
                variant={"default"}
                onClick={() => {}}
              >
                Create account
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default SingupMulti;
