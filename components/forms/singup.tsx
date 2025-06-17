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
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react"

import { useFileUpload } from "@/hooks/use-file-upload"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(5, { message: "Senhas precisam ter pelomenos 5 caracteres." }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "Nome não pode ficar vazio." }),
  lastName: z.string().min(1, { message: "Sobrenome não pode ficar vazio." }),
  estate: z.string(),
  city: z.string(),
  street: z.string(),
  cep: z.string().min(8, {}),
});
function SingupMulti() {

 
  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024 // 5MB default


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
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  })
  const [isLoading, setLoading] = useState<boolean>(false);
  const [cepLoad, setCepLoad] = useState<boolean>(false);
  const previewUrl = files[0]?.preview || null
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
           
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
             
              <div className="space-y-2 ">
                                <h2 className="text-muted-foreground">Login</h2>

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
              <div>
                <h2 className="text-muted-foreground">Informações pessoais</h2>
                  <div className="flex flex-col gap-2">
      <div className="relative border border-dashed my-4">
        {/* Drop area */}
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload file"
          />
          {previewUrl ? (
            <div className="absolute inset-0 h-59 ">
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || "Uploaded image"}
                className="size-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Selecione uma imagem sua.
              </p>
              <p className="text-muted-foreground text-xs">
                Tamanho máximo: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      <p
        aria-live="polite"
        role="region"
        className="text-muted-foreground mt-2 text-center text-xs"
      >
       
        <a
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
          className="hover:text-foreground underline"
        >
         
        </a>
      </p>
    </div>
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
                
              </div>
              <div className="space-y-7">
              
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                 
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
