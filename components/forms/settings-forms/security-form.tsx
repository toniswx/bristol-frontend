"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
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
import {
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  LifeBuoyIcon,
  Link2Icon,
  LucideShieldUser,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MenubarRadioGroup } from "@/components/ui/menubar";

function SecurityForm({ userData }: { userData: User }) {
  const { set } = useUserStore();

  const profileSchema = z.object({
    oldPassword: z
      .string()
      .min(8, { message: "Senha precisa ter pelo menos 8 caracteres." })
      .regex(/[0-9]/, { message: "At least 1 number" })
      .regex(/[a-z]/, { message: "At least 1 lowercase letter" })
      .regex(/[A-Z]/, { message: "At least 1 uppercase letter" }),
    newPassword: z
      .string()
      .min(8, { message: "Senha precisa ter pelo menos 8 caracteres." })
      .regex(/[0-9]/, { message: "At least 1 number" })
      .regex(/[a-z]/, { message: "At least 1 lowercase letter" })
      .regex(/[A-Z]/, { message: "At least 1 uppercase letter" }),
    desconect: z.boolean().default(false).optional(),
    preferences: z.enum(["all", "verified"]),
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      preferences: userData ? userData.preferences : "all",
    },
  });

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

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    toast.promise(
      (async () => {
        try {
          const response = await fetch("http://localhost:5000/users", {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const data = await response.json();

          if (data.message && data.message[0].includes("")) {
            form.setError("root", {
              message: "",
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
  const items = [
    {
      id: "1",
      icon: LucideShieldUser,
      title: "Gerenciamento de Senha",
      sub: "Atualize sua senha de acesso",
      content: (
        <div className="my-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="">
                <div>
                  <div className="grid grid-cols-1 gap-2">
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antiga</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                              className=""
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova</FormLabel>
                          <FormControl>
                            <div>
                              <div className="*:not-first:mt-2">
                                <div className="relative">
                                  <Input
                                    {...field}
                                    className="pe-9"
                                    placeholder=""
                                    type={isVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                      form.setValue(
                                        "newPassword",
                                        e.target.value
                                      );
                                    }}
                                  />
                                  <button
                                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    type="button"
                                    onClick={toggleVisibility}
                                    aria-label={
                                      isVisible
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                    aria-pressed={isVisible}
                                    aria-controls="password"
                                  >
                                    {isVisible ? (
                                      <EyeOffIcon
                                        size={16}
                                        aria-hidden="true"
                                      />
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
                                  style={{
                                    width: `${(strengthScore / 4) * 100}%`,
                                  }}
                                ></div>
                              </div>

                              {/* Password strength description */}
                              <p
                                id={`${1}-description`}
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
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="desconect"
                  render={({ field }) => (
                    <FormItem className=" ">
                      <FormControl>
                        <div className="inline-flex items-center gap-2 mt-6">
                          <Switch id="desc  " />
                          <Label htmlFor="desc  ">
                            Me desconectar de outros dispositivos
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex items-center justify-between">
                <Button disabled={!form.formState.isDirty}>Salvar</Button>
              </div>
            </form>
          </Form>
        </div>
      ),
    },

    {
      id: "3",
      icon: ShieldCheckIcon,
      title: "Recuperação de conta",
      sub: "Proteja sua conta com uma segurança adicional",
      content:
        "Protect your account with two-factor authentication. You can use authenticator apps like Google Authenticator or Authy, receive SMS codes, or use security keys like YubiKey. We recommend using an authenticator app for the most secure experience.",
    },
    {
      id: "4",
      icon: LifeBuoyIcon,
      title: "Contact support",
      sub: "We're here to help 24/7",
      content:
        "Our support team is available around the ClockIcon to assist you. For billing inquiries, technical issues, or general questions, you can reach us through live chat, email at support@example.com, or schedule a call with our technical team. Premium support is available for enterprise customers.",
    },
  ];

  return (
    <div className="w-full h-full p-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Configurações de Segurança</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações de segurança da sua conta e proteja seus
          dados
        </p>
      </div>
      <div>
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {items.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="py-2 bg">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <item.icon size={16} className="opacity-60" />
                      </span>
                      <span className="flex flex-col space-y-1">
                        <span>{item.title}</span>
                        {item.sub && (
                          <span className="text-sm font-normal">
                            {item.sub}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronDownIcon
                      size={16}
                      className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2 ">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default SecurityForm;
