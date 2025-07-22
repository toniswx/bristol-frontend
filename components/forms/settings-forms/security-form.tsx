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
  Clipboard,
  CommandIcon,
  Download,
  EclipseIcon,
  EyeIcon,
  EyeOffIcon,
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
import ChangePassowordForm from "./change-password-form";
import EmailVerification from "./email-verification";
import RecoveryEmail from "./recovery-email";

function SecurityForm({ userData }: { userData: User }) {
  const sub_menu_account_protect = [
    {
      id: "1",
      icon: userData.recoveryEmail ? (
        <Mail className="w-5 h-5 text-green-300" />
      ) : (
        <Mail className="w-5 h-5 text-amber-500" />
      ),
      title: "Email de recuperação",
      subicon: userData.recoveryEmail ? (
        ""
      ) : (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          {" "}
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />{" "}
          Necessita de atualização
        </Badge>
      ),

      content: (
        <div>
          <RecoveryEmail userData={userData} />
        </div>
      ),
    },
    {
      id: "2",
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      title: "Códigos de Recuperação de Conta",
      subicon: userData.metadata[0].twoFactorEnabled ? (
        ""
      ) : (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          {" "}
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />{" "}
          Necessita de atualização
        </Badge>
      ),
      content: (
        <div className="border px-10 py-5 rounded-md  ">
          {" "}
          <div className="rounded-md  border-amber-500/50  py-3 text-amber-600 flex items-center justify-between">
            <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
              <p className="text-sm">
                <InfoIcon
                  className="me-3 -mt-0.5 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Estes códigos são sua última opção de recuperação. Guarde-os em
                um local seguro e nunca os compartilhe.
              </p>
            </div>
          </div>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Você ainda não gerou códigos de backup.
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Cada código pode ser usado apenas uma vez. Novos códigos invalidam
            os anteriores.
          </p>
        </div>
      ),
    },
  ];
  const sub_menu_email = [
    {
      id: "1",
      icon: userData.metadata[0].emailVerified ? (
        <Mail className="w-5 h-5 text-green-300" />
      ) : (
        <Mail className="w-5 h-5 text-amber-500" />
      ),
      title: "Verificação de email",
      subicon: userData.metadata[0].emailVerified ? (
        ""
      ) : (
        <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full">
          {" "}
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />{" "}
          Necessita de atualização
        </Badge>
      ),

      content: (
        <div>
          <EmailVerification userData={userData} />
        </div>
      ),
    },
  ];
  const items = [
    {
      id: "1",
      icon: LucideShieldUser,
      title: "Gerenciamento de Senha",
      sub: "Atualize sua senha de acesso",
      customIcon: "",
      content: (
        <div className="my-3">
          <ChangePassowordForm userData={userData} />
        </div>
      ),
    },

    {
      id: "2",
      icon: IdCard,
      title: "Verificação de credenciais",
      sub: "Verifique seu email para usar a plataforma com mais segurança.",

      content: (
        <div>
          <Separator className="my-2" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {sub_menu_email.map((item) => (
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
    {
      id: "3",
      icon: ShieldCheckIcon,
      title: "Proteção de conta",
      sub: "Proteja sua conta com uma segurança adicional",

      content: (
        <div>
          <Separator className="my-2" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {sub_menu_account_protect.map((item) => (
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
