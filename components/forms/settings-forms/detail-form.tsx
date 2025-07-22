"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { map, object, z } from "zod";
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
  AtSignIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  CirclePower,
  CirclePowerIcon,
  Clipboard,
  CommandIcon,
  Download,
  EclipseIcon,
  EyeIcon,
  EyeOffIcon,
  Fingerprint,
  IdCard,
  InfoIcon,
  LifeBuoyIcon,
  Link2Icon,
  LucideShieldUser,
  Mail,
  Plus,
  PlusIcon,
  Shield,
  ShieldAlert,
  ShieldCheckIcon,
  XIcon,
  ZapIcon,
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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import OTP from "./otp-codigos";
import { CloseIcon } from "@/components/tiptap-icons/close-icon";
import { Badge } from "@/components/ui/badge";

function DetailFormProfile({ userData }: { userData: User }) {
  const { set } = useUserStore();

  console.log(userData);

  useEffect(() => {
    console.log(Object.entries(userData.metadata[0]).map((item) => item[0]));
  });
  const profileSchema = z.object({
    accountdelete: z.string(),
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      accountdelete: "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const changedFieldNames = Object.keys(form.formState.dirtyFields);

    const n = {};

    changedFieldNames.map((fieldName) => {
      return (n[fieldName] = values[fieldName]);
    });

    console.log(values);

    /*(async () => {
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
      }; */
  }

  function formatKeyName(key: string): string {
    const names: Record<string, string> = {
      emailVerified: "Verificação de E-mail",
      twoFactorEnabled: "Autenticação em 2 Etapas",
      registrationIp: "IP de Registro",
      registrationDevice: "Dispositivo de Registro",
      lastLogin: "Último Acesso",
      lastLoginIp: "IP do Último Acesso",
      loginCount: "Total de Logins",
      failedLoginAttempts: "Tentativas Falhas",
      profileVersion: "Versão do Perfil",
      createdAt: "Conta Criada Em",
      updatedAt: "Última Atualização",
      accountLockedUntil: "Conta Bloqueada Até",
    };

    return names[key] || key;
  }

  function formatValue(key: string, value: any): React.ReactNode {
    if (value === null || value === undefined) return "Não disponível";

    switch (key) {
      case "emailVerified":
      case "twoFactorEnabled":
        return (
          <Badge
            className={
              value
                ? "bg-green-600/10 dark:bg-green-600/20 hover:bg-green-600/10 text-green-500 border-green-600/60 shadow-none rounded-full"
                : "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full"
            }
          >
            {" "}
            <div
              className={
                value
                  ? "h-1.5 w-1.5 rounded-full bg-green-500 mr-2"
                  : "h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"
              }
            />{" "}
            {value ? "Ativado" : "Desativado"}
          </Badge>
        );

      case "createdAt":
      case "updatedAt":
      case "lastLogin":
      case "accountLockedUntil":
        return new Date(value).toLocaleString("pt-BR");

      case "loginCount":
      case "failedLoginAttempts":
      case "profileVersion":
        return value.toString();

      default:
        return value.toString();
    }
  }

  const sub_menu = [
    {
      id: "1",
      icon: <IdCard />,
      title: "Detalhes da conta",
      subicon: "",

      content: (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Detalhes da Conta
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(userData.metadata[0]).map(([key, value]) => {
              // Ignorar campos sensíveis ou irrelevantes
              if (
                ["id", "userId", "twoFactorSecret", "deviceHash"].includes(key)
              )
                return null;

              return (
                <div key={key} className="bg-gray-50 p-3 rounded-md">
                  <dt className="text-xs font-medium text-gray-500 capitalize">
                    {formatKeyName(key)}
                  </dt>
                  <dd className="mt-1 text-xs text-gray-900">
                    {formatValue(key, value)}
                  </dd>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: "11",
      icon: <CirclePowerIcon />,
      title: "Deletar minha conta",
      subicon: "",

      content: (
        <div className=" space-y-4 p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Deletar minha conta</Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <CircleAlertIcon className="opacity-80" size={16} />
                </div>
                <DialogHeader>
                  <DialogTitle className="sm:text-center">
                    Confirmação
                  </DialogTitle>
                  <DialogDescription className="sm:text-center">
                    Esta ação não pode ser desfeita. Para confirmar, insira o
                    seu email
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="*:not-first:mt-2">
                <FormField
                  control={form.control}
                  name="accountdelete"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        Digite o seu email para deletar a sua conta.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={form.getValues().accountdelete !== userData.email}
                >
                  Deletar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

  const items = [
    {
      id: "3",
      icon: ShieldCheckIcon,
      title: "Informações e dados",
      sub: "Gerencie suas informações pessoais.",

      content: (
        <div>
          <Separator className="my-2" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {sub_menu.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="py-2">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                    <span className="flex items-center gap-3">
                      {item.icon}
                      <p className="text-sm">{item.title}</p>
                      {item.subicon}
                    </span>
                    <PlusIcon
                      size={16}
                      className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="">{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Detalhes da sua conta</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e preferências.
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {item.content}
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default DetailFormProfile;
