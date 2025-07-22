"use client";
import React, { useMemo, useState } from "react";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, EyeIcon, EyeOffIcon, Loader, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/currentUserStore";
import { User } from "@/types";
import { toast } from "sonner";

function ChangePassowordForm({ userData }: { userData: User }) {
  const { set } = useUserStore();

  const passwordSchema = z
    .string()
    .min(8, { message: "Senha precisa ter pelo menos 8 caracteres." })
    .regex(/[0-9]/, { message: "At least 1 number" })
    .regex(/[a-z]/, { message: "At least 1 lowercase letter" })
    .regex(/[A-Z]/, { message: "At least 1 uppercase letter" });

  const newPasswordSchema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  });

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:5000/users/credential", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        form.control._disableForm(false);

        form.reset();
        setPassword("");
        setLoading(false);
        set(data);
        toast.success("Senha atualizada com sucesso.");

        return data;
      } catch (error) {
        form.control._disableForm(false);

        if (error.message === "invalid password") {
          form.setError("oldPassword", {
            message: "Senha antiga não esta correta.",
          });
        }
        setLoading(false);
      }
    }, 10000);
  }

  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

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

  return (
    <div>
      {isLoading ? (
        <div>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-2 space-y-3">
              <div>
                <div className="h-4 bg-gray-200 rounded my-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded my-3"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded my-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded my-3"></div>
              </div>
            </div>
          </div>

           <Button disabled > <Loader className="animate-spin"/> </Button>
        </div>
      ) : (
        <Form {...form}>
          {" "}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <div className="">
                <div>
                  <div className="grid grid-cols-1 gap-2 space-y-3">
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antiga senha</FormLabel>
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
                          <FormLabel>Nova senha</FormLabel>
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
                                        ? "Esconder senha"
                                        : "Mostrar senha"
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
              </div>

              <div className="w-full flex items-center justify-between my-5">
                <Button disabled={!form.formState.isDirty}>Salvar</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ChangePassowordForm;
