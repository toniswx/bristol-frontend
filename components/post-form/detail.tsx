"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useEffect, useRef, useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormState } from "@/lib/stores/formStore";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { RadioItem } from "@radix-ui/react-dropdown-menu";

const formSchema = z.object({
  price: z.string().min(1, {
    message: "O preço é obrigatório",
  }),
  IPTU: z.string().min(1, {
    message: "O IPTU é obrigatório",
  }),
  garage: z.enum(["0", "1", "2", "3", "4", "5 ou mais"], {
    required_error: "Selecionar um número é obrigatório",
  }),
  bathrooms: z.enum(["0", "1", "2", "3", "4", "5 ou mais"], {
    required_error: "Selecionar um número é obrigatório",
  }),
  bedrooms: z.enum(["0", "1", "2", "3", "4", "5 ou mais"], {
    required_error: "Selecionar um número é obrigatório",
  }),
  area: z.string().min(1, {
    message: "A área é obrigatória",
  }),
});

function DetailForm() {
  const priceRef = useRef<HTMLInputElement>(null);
  const iptuRef = useRef<HTMLInputElement>(null);

  const areaRef = useRef<HTMLInputElement>(null);

  const formState = useFormState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: formState.form.price,
      IPTU: formState.form.IPTU,
      area: formState.form.area,
    },
  });

  const handleInputChange = (
    ref: React.RefObject<HTMLInputElement>,
    inputName:
      | "price"
      | "IPTU"
      | "rooms"
      | "garage"
      | "bathrooms"
      | "bedrooms"
      | "area"
  ) => {
    if (ref.current) {
      const formattedValue = formatInputToNumber(ref.current.value);

      if (inputName === "price" || inputName === "IPTU") {
        const x = formatCurrency(formattedValue);
        form.setValue(inputName, x);
      } else {
        form.setValue(inputName, formattedValue);
      }
    }
  };

  const formatInputToNumber = (value: string) => {
    return value.replace(/\D/g, "");
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    formState.setFormData(values);
    formState.setFormStep();
  }

  const formatCurrency = (value: string) => {
    const numberStr = value.replace(/[^\d,]/g, "").replace(",", ".");

    if (value === "") return;
    const number = parseFloat(numberStr);

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    form.setValue("garage", formState.form.garage!);
    form.setValue("bathrooms", formState.form.bathrooms!);
    form.setValue("bedrooms", formState.form.bedrooms!);
  }, [formState.form]);
  const handleGoBack = () => formState.setGoBackOneStep();

  return (
    <div className="my-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=" space-y-5  ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 1.500.000"
                        {...field}
                        ref={priceRef}
                        onChange={(e) => {
                          handleInputChange(priceRef, "price");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="IPTU"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do IPTU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 2.500,00"
                        {...field}
                        ref={iptuRef}
                        onChange={(e) => {
                          handleInputChange(iptuRef, "IPTU");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="150.75"
                        {...field}
                        ref={areaRef}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value))
                            handleInputChange(areaRef, "area");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 ">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl className="">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={formState.form.bedrooms}
                        className=""
                      >
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="3" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="4" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="5 ou mais" />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={formState.form.bathrooms}
                        className=""
                      >
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="3" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="4" />
                          </FormControl>
                        </FormItem>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem value="5 ou mais" />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas na garagem</FormLabel>
                    <FormControl>
                      <div>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={formState.form.bathrooms}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="0" />
                                </FormControl>

                                <FormControl>
                                  <RadioGroupItem value={"1"} />
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value={"2"} />
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value={"3"} />
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value={"4"} />
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value={"5 ou mais"} />
                                </FormControl>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => {
                handleGoBack();
              }}
            >
              <ArrowLeft /> Voltar{" "}
            </Button>{" "}
            <Button type="submit">
              Próximo <ArrowRight />{" "}
            </Button>{" "}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default DetailForm;
