"use client";
import * as dotenv from "dotenv";
dotenv.config();
import React, { use, useEffect, useMemo, useState } from "react";
import { map, z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { toast } from "sonner";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
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
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
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
  CheckIcon,
  CreditCard,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LoaderIcon,
  LoaderPinwheelIcon,
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
import ProgressBar from "./forms-components/progress-bar";
import { Ripple } from "../magicui/ripple";
import { MorphingText } from "../magicui/morphing-text";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";
import Logo from "../custom/logo";


interface formErrorData {
  formError: {
    formName: string;
    formMessage: string;
  };
}
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
  preferences: z.enum(["all", "verified"]),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
  profilePictureUrl: z.instanceof(File),
});

type FormData = z.infer<typeof formSchema>;

const steps = [0, 1, 2, 3, 4];

function SingupMulti() {
  const [formData, setData] = useState<Partial<FormData>>({});
  const [formErrorData, setFormErrorData] = useState<formErrorData | null>(
    null
  );

  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(0);

  const uniqueId = uuidv4();
  const router = useRouter();

  const queryClient = useQueryClient();

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const supabaseUrl = "https://qhljimmosiizyuxvrrlp.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined;

  const HandleSetData = (data: Partial<FormData>) => {
    setData((oldValue) => ({
      ...oldValue,
      ...data,
    }));

    setCurrentStep((oldValue) => oldValue + 1);

    if (currentStep === 4) {
      onSubmit();
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((oldValue) => oldValue - 1);
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
        .upload(`private/${id}/${uniqueId}`, formData.profilePicture as File);

      if (error) throw error;
      const path = `https://qhljimmosiizyuxvrrlp.supabase.co/storage/v1/object/${data.fullPath}`;
      return path;
    } catch (error) {
      throw new Error("ImageUploadError");
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

  const createUser = async (values: Partial<FormData>)  => {
    try {
      const data = await fetch("http://localhost:5000/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          profilePictureUrl: "placeholder.com",
          bio: values.bio,
        }),
      });

      const response = await data.json();


      if (!data.ok) {
        if (response.message === "Conflict") {
          setFormErrorData({
            formError: {
              formMessage: "Email invalido, tente outro email.",
              formName: "email",
            },
          });
          setCurrentStep(0);
        }
        throw new Error("Conflict");
      }

      return response ;
    } catch (err) {
      throw err;
    }
  };
  async function onSubmit() {
    setLoading(true);
    try {

      const {preferences,...data} = formData

      const newUserData = await createUser(data);

      console.log(newUserData)

      /* const pictureUrl = await uploadPicture(newUserData.token, newUserData.id);

      if (pictureUrl === undefined) return;

      const update = await updatePicture(pictureUrl);

      if (update) {
        queryClient.setQueryData(["userData"], update);
        router.push("/");
      } */


      if (newUserData) {
        queryClient.setQueryData(["userData"], newUserData);
        router.push("/");
      }
    } catch (err) {
      if (err.message === "Conflict") {
        console.log(err);
      }
      if (err.message === "ImageUploadError") {
        console.log(err);
      }
    }
  }

  const submit = () => {
    onSubmit();
  };

  const fields = [
    {
      title: "Credenciais",
      subtitle: "Suas credenciais usadas para entrar na sua conta.",
      field: (
        <FormStepOne
          formErrorData={formErrorData}
          handleSetData={HandleSetData}
          handlePrevieusStep={handlePreviousStep}
          disablePreviousButton={true}
          disableNextButton={false}
        />
      ),
    },
    {
      title: "Endereço",
      subtitle:
        "Informações de localização são públicas para atender regulamentações do setor imobiliário.",
      field: (
        <FormStepTwo
          handlePrevieusStep={handlePreviousStep}
          handleSetData={HandleSetData}
          disablePreviousButton={false}
          disableNextButton={false}
        />
      ),
    },
    {
      title: "Sobre você",
      subtitle: "Suas informações publicas.",
      field: (
        <FormStepThree
          handlePrevieusStep={handlePreviousStep}
          handleSetData={HandleSetData}
          disablePreviousButton={false}
          disableNextButton={false}
        />
      ),
    },
    {
      title: "Preferências",
      subtitle: "Personalize como deseja usar a plataforma.",
      field: (
        <FormStepFour
          handleOnSubmit={submit}
          handlePrevieusStep={handlePreviousStep}
          handleSetData={HandleSetData}
          disablePreviousButton={false}
          disableNextButton={false}
        />
      ),
    },
    {
      title: "",
      subtitle: "",
      field: (
        <div className="w-full flex items-center justify-center">
          <div>
            <FullPageLoad />
          </div>
        </div>
      ),
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Credenciais",
      description: "Suas informações",
    },
    {
      step: 2,
      title: "Endereço",
      description: "Local onde você atua",
    },
    {
      step: 3,
      title: "Sobre você",
      description: "Conte sobre você",
    },
    {
      step: 4,
      title: "Preferências",
      description: "Costumize sua conta",
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="space-y-8 text-center my-10">
          <Stepper value={currentStep + 1} className="w-full ">
            {steps.map(({ step, title, description }) => (
              <StepperItem
                key={step}
                step={step}
                className="not-last:flex-1 max-md:items-start"
              >
                <StepperIndicator className="mx-2" />
                <div className="text-center md:text-left ">
                  <StepperDescription className="max-sm:hidden">
                    {description}
                  </StepperDescription>
                </div>

                {step < steps.length && (
                  <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        {fields.map((item, index) => {
          return (
            <div key={index} className={currentStep === index ? "" : "hidden"}>
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              {item.field}
            </div>
          );
        })}
      </div>
    </>
  );
}
/*<h2 className="text-2xl font-semibold">{fields[currentStep].title}</h2>
        <p className="text-sm text-muted-foreground">
          {fields[currentStep].subtitle}
        </p>
        {fields[currentStep].field}*/
const FormStepOne = ({
  handleSetData,
  disablePreviousButton,
  disableNextButton,
  handlePrevieusStep,
  formErrorData,
}: {
  handleSetData(data: Partial<FormData>): void;
  handlePrevieusStep(): void;
  disablePreviousButton: boolean;
  disableNextButton: boolean;
  formErrorData: formErrorData | null;
}) => {
  const StepOneSchema = z.object({
    email: z.string().email({ message: "Email invalido." }),
    password: z
      .string()
      .min(8, { message: "Senha precisa ter pelo menos 8 caracteres." })
      .regex(/[0-9]/, { message: "At least 1 number" })
      .regex(/[a-z]/, { message: "At least 1 lowercase letter" })
      .regex(/[A-Z]/, { message: "At least 1 uppercase letter" }),
  });

  const id = useId();
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Pelo menos 8 caracteres" },
      { regex: /[0-9]/, text: "Pelo menos 1 número" },
      { regex: /[a-z]/, text: " Pelo menos 1 caractere minúsculo " },
      { regex: /[A-Z]/, text: "Pelo menos 1 caractere maiúsculo " },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };
  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Digite uma senha";
    if (score <= 2) return "Senha fraca";
    if (score === 3) return "Senha media";
    return "Senha forte";
  };

  const form = useForm<z.infer<typeof StepOneSchema>>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof StepOneSchema>) {
    handleSetData(values);
  }

  useEffect(() => {
    formErrorData !== null
      ? form.setError("email", { message: formErrorData.formError.formMessage })
      : null;
  }, [formErrorData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Senha <span className="text-red-400">* </span>
              </FormLabel>
              <FormControl>
                <div>
                  <div className="*:not-first:mt-2">
                    <Label htmlFor={id}></Label>
                    <div className="relative">
                      <Input
                        {...field}
                        id={id}
                        className="pe-9"
                        placeholder=""
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          form.setValue("password", e.target.value);
                        }}
                        aria-describedby={`${id}-description`}
                      />
                      <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  <div
                    className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
                    role="progressbar"
                    aria-valuenow={strengthScore}
                    aria-valuemin={0}
                    aria-valuemax={4}
                    aria-label="Password strength"
                  >
                    <div
                      className={`h-full ${getStrengthColor(
                        strengthScore
                      )} transition-all duration-500 ease-out`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    ></div>
                  </div>

                  {/* Password strength description */}
                  <p
                    id={`${id}-description`}
                    className="text-foreground mb-2 text-sm font-medium"
                  >
                    {getStrengthText(strengthScore)}. Deve conter:
                  </p>

                  {/* Password requirements list */}
                  <ul
                    className="space-y-1.5"
                    aria-label="Password requirements"
                  >
                    {strength.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckIcon
                            size={16}
                            className="text-emerald-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <XIcon
                            size={16}
                            className="text-muted-foreground/80"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`text-xs ${
                            req.met
                              ? "text-emerald-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {req.text}
                          <span className="sr-only">
                            {req.met
                              ? " - Requirement met"
                              : " - Requirement not met"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            disabled={!disableNextButton}
            onClick={handlePrevieusStep}
          >
            Anterior
          </Button>
          <Button type="submit" disabled={disableNextButton}>
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};

/* <div className=" mt-2">
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
        </div> */
const FormStepTwo = ({
  handleSetData,
  disablePreviousButton,
  disableNextButton,
  handlePrevieusStep,
}: {
  handleSetData(data: Partial<FormData>): void;
  handlePrevieusStep(): void;

  disablePreviousButton: boolean;
  disableNextButton: boolean;
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedEstate, setSelectedEstate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSetInputValue = (city: string, estate: string, uf: string) => {
    setSelectedLocation(city);
    setSelectedEstate(estate);
    setSelectedCity(city);

    form.setValue("city", city);
    form.setValue("estate", estate);
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
    handleSetData(values);
  }

  return (
    <Form {...form}>
      {" "}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-6">
          <div className="grid  gap-x-2 ">
            <p className="text-sm">
              Cidade <span className="text-red-400">* </span>
            </p>
            <div className="my-3 w-full flex items-center justify-start border rounded-md bg-white">
              {selectedEstate && (
                <div className=" min-w-1/5 bg-muted-foreground/10 text-sm border-r px-4 py-2">
                  {selectedEstate}
                </div>
              )}
              <p className="px-1 pl-3">
                <Search className="text-xs text-muted-foreground/50 w-3 h-5" />
              </p>
              <Input
                className="  px-2 py-2 my-0  h-fit border-none shadow-none select-none focus-visible:ring-0 focus:border-none ring-0 w-full"
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
                        {mun}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        em {estateName}, {uf}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <Button
            type="button"
            disabled={disableNextButton}
            onClick={handlePrevieusStep}
          >
            Anterior
          </Button>
          <Button type="submit" disabled={disablePreviousButton}>
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};
const FormStepThree = ({
  handleSetData,
  disablePreviousButton,
  disableNextButton,
  handlePrevieusStep,
}: {
  handleSetData(data: Partial<FormData>): void;
  handlePrevieusStep(): void;

  disablePreviousButton: boolean;
  disableNextButton: boolean;
}) => {
  const stepThreeSchema = z.object({
    firstName: z.string().min(1, { message: "Nome não pode ficar vazio." }),
    lastName: z.string().min(1, { message: "Sobrenome não pode ficar vazio." }),

    preferences: z.enum(["all", "verified"]),
    bio: z
      .string()
      .min(10, {
        message: "Bio tem que ter pelo menos 10 caracteres.",
      })
      .max(160, {
        message: "Bio não pode ser maior que 120 caracteres.",
      }),
  });

  const id = useId();

  /*  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });
  const previewUrl = files[0]?.preview || null;
  const profilePicture = (files[0]?.file as File) || null; */

  const form = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      preferences: "all",
    },
  });

  function onSubmit(values: z.infer<typeof stepThreeSchema>) {
    /*if (profilePicture === null) {
      form.setError("root", {
        message: "Selecione uma foto",
      });
      return;
    } */
    handleSetData({ ...values });
  }
  /*
  useEffect(() => {
    if (files.length > 0) {
      form.clearErrors();
    }
  }, [files]); 
    <div className=" h-full justify-center flex flex-col items-center gap-2 col-span-1 my-4  rounded-md p-1">
                <div className="relative inline-flex">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative size-24  rounded-full overflow-hidden p-0 shadow-none"
                    onClick={openFileDialog}
                    aria-label={previewUrl ? "Change image" : "Upload image"}
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
   */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="">
          <div>
            <div className="grid grid-cols-3 gap-2   ">
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
                        Sobrenome <span className="text-red-400">* </span>
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
        </div>
        <div className="w-full flex  items-center justify-between">
          <Button
            type="button"
            disabled={disableNextButton}
            onClick={handlePrevieusStep}
          >
            Anterior
          </Button>
          <Button type="submit" disabled={disablePreviousButton}>
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};

const FormStepFour = ({
  handleSetData,
  disablePreviousButton,
  disableNextButton,
  handlePrevieusStep,
  handleOnSubmit,
}: {
  handleSetData(data: Partial<FormData>): void;
  handlePrevieusStep(): void;
  handleOnSubmit(): void;
  disablePreviousButton: boolean;
  disableNextButton: boolean;
}) => {
  const stepThreeSchema = z.object({
    preferences: z.enum(["all", "verified"]),
  });

  const id = useId();

  const form = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      preferences: "all",
    },
  });

  function onSubmit(values: z.infer<typeof stepThreeSchema>) {
    handleSetData(values);
    handleOnSubmit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-6">
          <div className="">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <p className="my-3 mt-3 text-sm">Receber mensages de :</p>
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
                            <Label htmlFor={`${id}-1`}>Todas as contas</Label>
                            <p
                              id={`${id}-1-description`}
                              className="text-muted-foreground text-xs"
                            >
                              Contas não verificadas poderão mandar messagem
                              para você.
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
                              Somete contas verificadas poderão mandar mensagem
                              para você.
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

        <div className="w-full flex items-center justify-between">
          <Button
            type="button"
            disabled={disablePreviousButton}
            onClick={handlePrevieusStep}
          >
            Anterior
          </Button>
          <Button type="submit" disabled={disableNextButton}>
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SingupMulti;
