"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { map, object, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { toast } from "sonner";
import { useUserStore } from "@/lib/stores/currentUserStore";

function ProfileForm({ userData }: { userData: User }) {
  const { set } = useUserStore();

  const profileSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "Nome não pode ficar vazio." })
      .max(30, { message: "O nome não pode ultrapassar 25 caracteres." })
      .optional(),
    lastName: z
      .string()
      .min(3, { message: "O Sobrenome não pode ultrapassar 25 caracteres." })
      .max(30, { message: "O nome não pode ultrapassar 25 caracteres." })
      .optional(),

    bio: z
      .string()
      .min(10, {
        message: "Bio tem que ter pelo menos 10 caracteres.",
      })
      .max(160, {
        message: "Bio não pode ser maior que 120 caracteres.",
      })
      .optional(),
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData ? userData.firstName : undefined,
      lastName: userData ? userData.lastName : undefined,
      bio: userData ? userData.bio : undefined,
    
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const changedFieldNames = Object.keys(form.formState.dirtyFields);

    const n = {};

    changedFieldNames.map((fieldName) => {
      return (n[fieldName] = values[fieldName]);
    });

    form.control._disableForm(true);

    toast.promise(
      (async () => {
        try {
          const response = await fetch("http://localhost:5000/users", {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(n),
          });

          const data = await response.json();

          if (
            data.message &&
            data.message[0].includes(
              "must be shorter than or equal to 30 characters"
            )
          ) {
            form.setError("root", {
              message: "Nome escolhido muito grande",
            });
            throw new Error();
          }
          if (data.error) throw new Error(data.error);

          form.control._disableForm(false);

          set(data);
          return data;
        } catch (error) {
          form.control._disableForm(false);
          throw error;
        }
      })(),
      {
        loading: "Atualizando perfil...",
        success: "Perfil atualizado com sucesso!",
        error: (err) => `Alguma coisa deu errado, tente novamente mais tarde.`,
      }
    );
  }

  useEffect(() => {
    form.reset(userData);
  }, [userData]);

  return (
    <div className="w-full h-full p-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Configurações de perfil</h2>
        <p className="text-sm text-muted-foreground">Ajuste seu perfil</p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="">
              <div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 gap-2 grid">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} className="" />
                          </FormControl>
                          <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-3 my-2">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder=""
                              className="resize-none bg-white"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <Button disabled={!form.formState.isDirty}>Salvar</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ProfileForm;
