"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
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
  estate: z.string(),
  city: z.string(),
  street: z.string(),
  cep: z.string().min(8, {
    message: "CEP precisar ter 8 números.",
  }),
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
  const id = useId();
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword !== values.password) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "A validação de senha falhou. Os campos devem ser idênticos.",
      });
      form.setError("password", {
        type: "manual",
      });
    }

    if (!previewUrl) {
      form.setError("root", {
        type: "manual",
        message: "Você precisa selecionar uma imagem.",
      });
      return;
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
          profilePictireURl: "",
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
      setCepLoad(false);
      console.error(err);
    }
  };

  const x = form.watch("cep");

  useEffect(() => {
    if (x.length === 8) {
      getUserAdress(x);
    }

    if (files.length > 0) {
      form.clearErrors();
    }
  }, [x]);

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;




useEffect(()=>{
  navigator.geolocation.getCurrentPosition(success, error, options);
},[])
  return (
    <div className="w-full   ">
      {isLoading ? (
        <FullPageLoad />
      ) : (
        <div className=" w-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              <div className="grid grid-cols-2 gap-x-6 ">
                <div className="">
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
                              <p className="text-sm font-medium">
                                Requisitos de senha:
                              </p>
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
                              <Input
                                placeholder=""
                                {...field}
                                type="password"
                              />
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
                              Confirme sua senha{" "}
                              <span className="text-red-400">* </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                type="password"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <p className="text-red-500 text-sm my-2 col-span-2">
                        {form.formState.errors.confirmPassword?.message}
                      </p>
                    </div>
                  </div>
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
                           Informações de localização são públicas para atender regulamentações do setor imobiliário.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      </div>
                      
                      <div className="rounded-md bg-accent/20 border mt-1 mb-5  border-blue-500/30 px-2 py-2 text-neutral-600">
                        <p className="text-sm">
                          <InfoIcon
                            className="me-3  text-blue-600 -mt-0.5 inline-flex opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                          Seu estado e cidade serão públicos no seu perfil.
                        </p>
                      </div>
                    </div>
                    <div className="grid  gap-x-2 gap-y-3">
                      <div className="">
                        <FormField
                          control={form.control}
                          name="cep"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                CEP <span className="text-red-400">* </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=""
                                  {...field}
                                  disabled={cepLoad}
                                  maxLength={8}
                                />
                              </FormControl>
                              <FormDescription>
                                Não sabe seu CEP ? <span className="font-semibold underline p-1 cursor-pointer">Clique aqui para preencher automaticamente.</span>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Cidade <span className="text-red-400">* </span>
                            </FormLabel>
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
                            <FormLabel>
                              Estado <span className="text-red-400">* </span>
                            </FormLabel>
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
                            <FormControl>
                              <Input
                                placeholder=" "
                                {...field}
                                disabled
                                className="hidden"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

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

                        <p
                          aria-live="polite"
                          role="region"
                          className="text-muted-foreground mt-2 text-xs"
                        >
                          Escolha uma foto sua.
                        </p>
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
                        <p className="text-sm my-1">Biografia</p>
                        <RichTextEditorDemo />
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
                      <p className="my-3 mt-3 text-sm">Receber mensages de :</p>
                      <RadioGroup className="gap-3" defaultValue="1">
                        <div className="flex items-start gap-2">
                          <RadioGroupItem
                            value="1"
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
                            value="2"
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
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link">Termos e Condições</Button>
                </DialogTrigger>
                <DialogContent className="z-[999] flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
                  <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">
                      Termos e Condições
                    </DialogTitle>
                    <div
                      ref={contentRef}
                      onScroll={handleScroll}
                      className="overflow-y-auto"
                    >
                      <DialogDescription asChild>
                        <div className="px-6 py-4">
                          <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <p>
                                  <strong>Aceitação dos Termos</strong>
                                </p>
                                <p>
                                  Ao acessar e usar este site, os usuários
                                  concordam em cumprir e estar vinculados a
                                  estes Termos de Serviço. Usuários que não
                                  concordam com estes termos devem descontinuar
                                  o uso do site imediatamente.
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>
                                    Responsabilidades da Conta de Usuário
                                  </strong>
                                </p>
                                <p>
                                  Os usuários são responsáveis por manter a
                                  confidencialidade de suas credenciais de
                                  conta. Qualquer atividade ocorrendo sob uma
                                  conta de usuário é de responsabilidade
                                  exclusiva do titular da conta. Os usuários
                                  devem notificar os administradores do site
                                  imediatamente sobre qualquer acesso não
                                  autorizado à conta.
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>Uso de Conteúdo e Restrições</strong>
                                </p>
                                <p>
                                  O site e seu conteúdo original são protegidos
                                  por leis de propriedade intelectual. Os
                                  usuários não podem reproduzir, distribuir,
                                  modificar, criar obras derivadas ou explorar
                                  comercialmente qualquer conteúdo sem permissão
                                  por escrito explícita dos proprietários do
                                  site.
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>Limitação de Responsabilidade</strong>
                                </p>
                                <p>
                                  O site fornece conteúdo "como está" sem
                                  qualquer garantia. Os proprietários do site
                                  não serão responsáveis por danos diretos,
                                  indiretos, incidentais, consequenciais ou
                                  punitivos decorrentes de interações dos
                                  usuários com a plataforma.
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>
                                    Diretrizes de Conduta do Usuário
                                  </strong>
                                </p>
                                <ul className="list-disc pl-6">
                                  <li>
                                    Não enviar conteúdo prejudicial ou malicioso
                                  </li>
                                  <li>
                                    Respeitar os direitos de outros usuários
                                  </li>
                                  <li>
                                    Evitar atividades que possam prejudicar a
                                    funcionalidade do site
                                  </li>
                                  <li>
                                    Cumprir com as leis locais e internacionais
                                    aplicáveis
                                  </li>
                                </ul>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>Modificações dos Termos</strong>
                                </p>
                                <p>
                                  O site reserva o direito de modificar estes
                                  termos a qualquer momento. O uso contínuo do
                                  site após alterações constitui aceitação dos
                                  novos termos.
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>Cláusula de Rescisão</strong>
                                </p>
                                <p>
                                  O site pode encerrar ou suspender o acesso do
                                  usuário sem aviso prévio por violações destes
                                  termos ou por qualquer outro motivo
                                  considerado apropriado pela administração.
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p>
                                  <strong>Lei Aplicável</strong>
                                </p>
                                <p>
                                  Estes termos são regidos pelas leis da
                                  jurisdição onde o site é operado
                                  primariamente, sem consideração a princípios
                                  de conflito de leis.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <DialogFooter className="border-t px-6 py-4 sm:items-center">
                    {!hasReadToBottom && (
                      <span className="text-muted-foreground grow text-xs max-sm:text-center">
                        Leia todos os termos antes de aceitar.
                      </span>
                    )}
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="button" disabled={!hasReadToBottom}>
                        Eu concordo
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                type="submit"
                className="my-3"
                variant={"default"}
                onClick={() => {}}
              >
                Criar conta
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default SingupMulti;
