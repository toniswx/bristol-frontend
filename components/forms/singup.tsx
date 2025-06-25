"use client";
import * as dotenv from "dotenv";
dotenv.config();
import React, { use, useEffect, useMemo, useState } from "react";
import { map, z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import FullPageLoad from "../custom/full-page-load";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Pin,
  Search,
  SearchX,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  AlertCircleIcon,
  CircleAlertIcon,
  CircleUserRoundIcon,
  Group,
  ImageUpIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import { useId } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import EditorDemo from "../EditorBiography";
import { RichTextEditorDemo } from "../blocks/editor-00/editor";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ChatBubbleIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import EstateFilter, { data } from "../custom/estate-filter";
import supabase from "../../supabase";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { randomBytes, randomUUID } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationPlaceholder } from "../placeholder-notifications";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalido." }),
  password: z
    .string()
    .min(5, { message: "Senhas precisam ter pelo menos 8 caracteres." }),
  confirmPassword: z
    .string()
    .min(8, { message: "Senhas precisam ter pelo menos 8 caracteres." }),
  firstName: z.string().min(1, { message: "Nome não pode ficar vazio." }),
  lastName: z.string().min(1, { message: "Sobrenome não pode ficar vazio." }),
  estate: z.string().min(1, { message: "Localização não pode ficar vazio." }),
  city: z.string().min(1, { message: "Localização não pode ficar vazio." }),
  preferencies: z.enum(["all", "verified"]),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
});

const steps = [1, 2, 3];

function SingupMulti() {
  const [currentStep, setCurrentStep] = useState(1);

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
      preferencies: "all",
      bio: "",
    },
  });

  const uniqueId = uuidv4();
  const router = useRouter();
  const id = useId();
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };
  const [isLoading, setLoading] = useState<boolean>(false);
  const [cepLoad, setCepLoad] = useState<boolean>(false);

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });
  const previewUrl = files[0]?.preview || null;
  const profilePicture = files[0]?.file || null;

  const supabaseUrl = "https://qhljimmosiizyuxvrrlp.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined;

  const confirmPassword = (password: string, passwordToCofirm: string) => {
    if (passwordToCofirm !== password) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "A validação de senha falhou. Os campos devem ser idênticos.",
      });
      form.setError("password", {
        type: "manual",
      });
      return false;
    }
    return true;
  };

  const hasSelectedPicture = () => {
    if (!previewUrl) {
      form.setError("root", {
        type: "manual",
        message: "Você precisa selecionar uma imagem.",
      });
      return false;
    } else {
      return true;
    }
  };

  const uploadPicture = async (
    token: string,
    id: string
  ): Promise<string | undefined> => {
    if (!supabaseKey) return;

    const supaclient = createClient(supabaseUrl, supabaseKey!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    try {
      const { data, error } = await supaclient.storage
        .from("images")
        .upload(`private/${id}/${uniqueId}`, profilePicture as File);

      if (!data) throw error;

      const path = `https://qhljimmosiizyuxvrrlp.supabase.co/storage/v1/object/${data.fullPath}`;
      return path;
    } catch (error) {
      throw error;
    }
  };

  const updatePicture = async (pictureUrl: string) => {
    console.log(pictureUrl + "123123");
    const update = await fetch("http://localhost:5000/users", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: pictureUrl }),
    });
    return update.json();
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!confirmPassword(values.password, values.confirmPassword)) return;

    if (!hasSelectedPicture()) return;

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
          state: values.estate,
          userProfilePicture: "placeholder.com",
          bio: values.bio,
          preferences: values.preferencies,
        }),
      });

      const response = await post.json();

      if (!response) return;

      const pictureUrl = await uploadPicture(response.token, response.id);

      if (pictureUrl === undefined) return;

      const update = await updatePicture(pictureUrl);

      if (update) {
        queryClient.setQueryData(["userData"], update); // Update cache immediately
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
      form.setValue("estate", data.estado);
      setCepLoad(false);
    } catch (err) {
      setCepLoad(false);
      console.error(err);
    }
  };

  const handleNextStep = () => {
    if (
      form.formState.errors.email ||
      form.formState.errors.password ||
      form.formState.errors.city ||
      form.formState.errors.confirmPassword
    ) {
      return;
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (files.length > 0) {
      form.clearErrors();
    }
  }, [files]);
  return (
    <div className="w-full   ">
      <div className=" space-y-8 text-center  w-full my-7">
        <Stepper value={currentStep} onValueChange={setCurrentStep}>
          {steps.map((step) => (
            <StepperItem
              key={step}
              step={step}
              className="not-last:flex-1"
              loading={isLoading}
            >
              <StepperTrigger asChild>
                <StepperIndicator />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
      </div>

      {isLoading ? (
        <FullPageLoad />
      ) : (
        <div className=" w-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 w-full"
            >
              {currentStep === 2 ? (
                <div className="">
                  <div className="my-2">
                    <h2 className="text-2xl font-semibold">Sobre você</h2>
                    <p className="text-muted-foreground text-sm">
                      Suas informações publicas.
                    </p>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-2   ">
                      <div className=" h-full justify-center flex flex-col items-center gap-2 col-span-1 my-4  rounded-md p-1">
                        <div className="relative inline-flex">
                          <Button
                            type="button"
                            variant="outline"
                            className="relative size-24  rounded-full overflow-hidden p-0 shadow-none"
                            onClick={openFileDialog}
                            aria-label={
                              previewUrl ? "Change image" : "Upload image"
                            }
                          >
                            {previewUrl ? (
                              <img
                                className="size-full object-contain"
                                src={previewUrl}
                                alt="Preview of uploaded image"
                                width={64}
                                height={64}
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div aria-hidden="true">
                                <CircleUserRoundIcon className="size-4 opacity-60" />
                              </div>
                            )}
                          </Button>
                          {previewUrl && (
                            <Button
                              onClick={() => removeFile(files[0]?.id)}
                              size="icon"
                              className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                              aria-label="Remove image"
                            >
                              <XIcon className="size-3.5" />
                            </Button>
                          )}
                          <input
                            {...getInputProps()}
                            className="sr-only"
                            aria-label="Upload image file"
                            tabIndex={-1}
                          />
                        </div>

                        {form.formState.errors.root?.message ? (
                          <p
                            aria-live="polite"
                            role="region"
                            className=" mt-2 text-xs text-red-600"
                          >
                            Escolha uma foto sua.
                          </p>
                        ) : (
                          <p
                            aria-live="polite"
                            role="region"
                            className="text-muted-foreground mt-2 text-xs"
                          >
                            Escolha uma foto sua.
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 gap-2 grid">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Nome <span className="text-red-400">* </span>
                              </FormLabel>

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
                              <FormLabel>
                                Sobrenome{" "}
                                <span className="text-red-400">* </span>
                              </FormLabel>
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
                              <FormDescription>
                                Fale sobre seu trabalho e você.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="my-2">
                      <h2 className="text-2xl font-semibold">Preferências</h2>
                      <p className="text-muted-foreground text-sm">
                        Personalize como deseja usar a plataforma.{" "}
                      </p>
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="preferencies"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div>
                                <p className="my-3 mt-3 text-sm">
                                  Receber mensages de :
                                </p>
                                <RadioGroup
                                  className="gap-3"
                                  defaultValue="all"
                                  onValueChange={field.onChange}
                                >
                                  <div className="flex items-start gap-2">
                                    <RadioGroupItem
                                      value="all"
                                      id={`${id}-1`}
                                      aria-describedby={`${id}-1-description`}
                                    />
                                    <div className="grid grow gap-2">
                                      <Label htmlFor={`${id}-1`}>
                                        Todas as contas
                                      </Label>
                                      <p
                                        id={`${id}-1-description`}
                                        className="text-muted-foreground text-xs"
                                      >
                                        Contas não verificadas poderão mandar
                                        messagem para você.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <RadioGroupItem
                                      value="verified"
                                      id={`${id}-2`}
                                      aria-describedby={`${id}-2-description`}
                                    />
                                    <div className="grid grow gap-2">
                                      <Label htmlFor={`${id}-2`}>
                                        Apenas contas verificadas
                                      </Label>
                                      <p
                                        id={`${id}-2-description`}
                                        className="text-muted-foreground text-xs"
                                      >
                                        Somete contas verificadas poderão mandar
                                        mensagem para você.
                                      </p>
                                    </div>
                                  </div>
                                </RadioGroup>
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep === 3 ? "" : null}

              {currentStep === 3 ? null : (
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    className="w-32"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    disabled={currentStep === 1}
                    type="button"
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-32"
                    onClick={handleNextStep}
                    disabled={currentStep > steps.length - 1}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      )}

      {currentStep === 1 ? <FormStepTwo /> : null}
    </div>
  );
}

const FormStepOne = () => {
  const StepOneSchema = z.object({
    email: z.string().email({ message: "Email invalido." }),
    password: z
      .string()
      .min(5, { message: "Senhas precisam ter pelo menos 8 caracteres." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Senhas precisam ter pelo menos 8 caracteres." }),
  });

  const form = useForm<z.infer<typeof StepOneSchema>>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof StepOneSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="my-2  ">
          <h2 className="text-2xl font-semibold">Credenciais</h2>
          <p className="text-muted-foreground text-sm">
            Suas credenciais usadas para entrar na sua conta.
          </p>
        </div>
        <div className="gap-y-4 my-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-400">* </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className=" mt-2">
          <div className="my-2">
            {form.formState.errors.password?.message ? (
              <div className="rounded-md border bg-white border-red-500/50 px-4 py-3 text-red-600">
                <div className="flex gap-3">
                  <div className="grow space-y-1">
                    <p className="text-sm font-medium">
                      A senha não atende aos requisitos:
                    </p>
                    <ul className="list-inside list-disc text-sm opacity-80">
                      <li>Mínimo de 8 caracteres</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md  border-neutral-500/30  px-4 py-3">
                <div className="flex gap-3">
                  <div className="grow space-y-1">
                    <p className="text-sm font-medium">Requisitos de senha:</p>
                    <ul className="text-muted-foreground list-inside list-disc text-sm">
                      <li>Mínimo de 8 caracteres</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2  ">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha <span className="text-red-400">* </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    Confirme sua senha <span className="text-red-400">* </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="text-red-500 text-sm my-2 col-span-2">
              {form.formState.errors.confirmPassword?.message}
            </p>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
const FormStepTwo = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedEstate, setSelectedEstate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSetInputValue = (city: string, estate: string, uf: string) => {
    setSelectedLocation(city);
    setSelectedEstate(estate);
    setSelectedCity(city);
  };

  const filteredData = useMemo(
    () =>
      data.flatMap((estate) =>
        estate.municipios
          .filter((mun) =>
            mun.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((mun) => ({ mun, estateName: estate.name, uf: estate.uf }))
      ),
    [data, searchValue]
  );

  const stepTwoSchema = z.object({
    estate: z.string().min(1, { message: "Localização não pode ficar vazio." }),
    city: z.string().min(1, { message: "Localização não pode ficar vazio." }),
  });

  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      estate: "",
      city: "",
    },
  });

  function onSubmit(values: z.infer<typeof stepTwoSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="mt-6">
        <div className="my-4">
          <div className="flex items-center justify-start">
            <h2 className="text-2xl font-semibold">Endereço</h2>
            <TooltipProvider delayDuration={1}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <QuestionMarkCircledIcon className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className=" cursor-pointer px-2 py-2 text-xs z-[90] ">
                  Informações de localização são públicas para atender
                  regulamentações do setor imobiliário.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="grid  gap-x-2 ">
          <p className="text-sm">
            Cidade <span className="text-red-400">* </span>
          </p>
          <div className=" w-full flex items-center justify-start border rounded-md bg-white">
            {selectedEstate && (
              <div className=" max-w-1/4 bg-muted-foreground/10 text-sm border-r px-4 py-2">
                {selectedEstate}
              </div>
            )}
            <p className="px-1 pl-3">
              <Search className="text-xs text-muted-foreground/50 w-3 h-5" />
            </p>
            <Input
              className=" w-fit px-2 py-2 my-0  h-fit border-none shadow-none select-none focus-visible:ring-0 focus:border-none ring-0"
              ref={searchInputRef}
              placeholder="Procure pela sua cidade.."
              value={selectedLocation || searchValue}
              onChange={() => {
                setSearchValue(searchInputRef.current?.value!);
                setSelectedLocation("");
                setSelectedEstate("");
              }}
            />
          </div>

          {selectedLocation ? (
            ""
          ) : (
            <ScrollArea className="h-[199px]  shadow">
              <ul className="flex flex-col w-full">
                {filteredData.map(({ mun, estateName, uf }) => (
                  <li
                    className="flex items-center justify-start w-full space-x-1 py-2 cursor-pointer hover:bg-accent-foreground/10 px-5"
                    key={`${mun} + ${Math.random()}`}
                    onClick={() => {
                      handleSetInputValue(mun, estateName, "");
                    }}
                  >
                    <Pin size={12} className="text-muted-foreground" />
                    <span className="text-xs text-accent-foreground font-stretch-semi-condensed">
                      {" "}
                      {mun}{" "}
                    </span>{" "}
                    <span className="text-muted-foreground text-xs">
                      {" "}
                      em {estateName}, {uf}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </Form>
  );
};
const FormStepThree = () => {
  const stepThreeSchema = z.object({
    firstName: z.string().min(1, { message: "Nome não pode ficar vazio." }),
    lastName: z.string().min(1, { message: "Sobrenome não pode ficar vazio." }),

    preferencies: z.enum(["all", "verified"]),
    bio: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
  });

  const id = useId();

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });
  const previewUrl = files[0]?.preview || null;
  const profilePicture = files[0]?.file || null;


  const form = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      preferencies: "all",
    },
  });

  function onSubmit(values: z.infer<typeof stepThreeSchema>) {
    console.log(values);
  }

    useEffect(() => {
    if (files.length > 0) {
      form.clearErrors();
    }
  }, [files]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="">
                  <div className="my-2">
                    <h2 className="text-2xl font-semibold">Sobre você</h2>
                    <p className="text-muted-foreground text-sm">
                      Suas informações publicas.
                    </p>
                  </div>

                  <div>
                    <div className="grid grid-cols-3 gap-2   ">
                      <div className=" h-full justify-center flex flex-col items-center gap-2 col-span-1 my-4  rounded-md p-1">
                        <div className="relative inline-flex">
                          <Button
                            type="button"
                            variant="outline"
                            className="relative size-24  rounded-full overflow-hidden p-0 shadow-none"
                            onClick={openFileDialog}
                            aria-label={
                              previewUrl ? "Change image" : "Upload image"
                            }
                          >
                            {previewUrl ? (
                              <img
                                className="size-full object-contain"
                                src={previewUrl}
                                alt="Preview of uploaded image"
                                width={64}
                                height={64}
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div aria-hidden="true">
                                <CircleUserRoundIcon className="size-4 opacity-60" />
                              </div>
                            )}
                          </Button>
                          {previewUrl && (
                            <Button
                              onClick={() => removeFile(files[0]?.id)}
                              size="icon"
                              className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                              aria-label="Remove image"
                            >
                              <XIcon className="size-3.5" />
                            </Button>
                          )}
                          <input
                            {...getInputProps()}
                            className="sr-only"
                            aria-label="Upload image file"
                            tabIndex={-1}
                          />
                        </div>

                        {form.formState.errors.root?.message ? (
                          <p
                            aria-live="polite"
                            role="region"
                            className=" mt-2 text-xs text-red-600"
                          >
                            Escolha uma foto sua.
                          </p>
                        ) : (
                          <p
                            aria-live="polite"
                            role="region"
                            className="text-muted-foreground mt-2 text-xs"
                          >
                            Escolha uma foto sua.
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 gap-2 grid">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Nome <span className="text-red-400">* </span>
                              </FormLabel>

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
                              <FormLabel>
                                Sobrenome{" "}
                                <span className="text-red-400">* </span>
                              </FormLabel>
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
                              <FormDescription>
                                Fale sobre seu trabalho e você.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="my-2">
                      <h2 className="text-2xl font-semibold">Preferências</h2>
                      <p className="text-muted-foreground text-sm">
                        Personalize como deseja usar a plataforma.{" "}
                      </p>
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="preferencies"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div>
                                <p className="my-3 mt-3 text-sm">
                                  Receber mensages de :
                                </p>
                                <RadioGroup
                                  className="gap-3"
                                  defaultValue="all"
                                  onValueChange={field.onChange}
                                >
                                  <div className="flex items-start gap-2">
                                    <RadioGroupItem
                                      value="all"
                                      id={`${id}-1`}
                                      aria-describedby={`${id}-1-description`}
                                    />
                                    <div className="grid grow gap-2">
                                      <Label htmlFor={`${id}-1`}>
                                        Todas as contas
                                      </Label>
                                      <p
                                        id={`${id}-1-description`}
                                        className="text-muted-foreground text-xs"
                                      >
                                        Contas não verificadas poderão mandar
                                        messagem para você.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <RadioGroupItem
                                      value="verified"
                                      id={`${id}-2`}
                                      aria-describedby={`${id}-2-description`}
                                    />
                                    <div className="grid grow gap-2">
                                      <Label htmlFor={`${id}-2`}>
                                        Apenas contas verificadas
                                      </Label>
                                      <p
                                        id={`${id}-2-description`}
                                        className="text-muted-foreground text-xs"
                                      >
                                        Somete contas verificadas poderão mandar
                                        mensagem para você.
                                      </p>
                                    </div>
                                  </div>
                                </RadioGroup>
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SingupMulti;
