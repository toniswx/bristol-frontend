"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { useFormState } from "@/lib/stores/formStore";
import { BackButtonForm, NextButtonForm } from "./formNextButton";
import { ArrowLeft, ArrowRight } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "O título precisa ter no mínimo 5 caracteres",
  }),
  textDescription: z.string().min(20, {
    message: "A descrição precisa ter no mínimo 20 caracteres",
  }),
});

function TitleDescriptionForm() {
  const formState = useFormState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formState.form.title,
      textDescription: formState.form.textDescription,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    formState.setFormData(values);
    formState.setFormStep();
  }

  const getData = (value: string) => {
    console.log(value);
    form.setValue("textDescription", value);
  };
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=" space-y-5 ">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do anúncio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Casa moderna com 3 quartos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>

                  <SimpleEditor getData={getData} />
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="button" disabled>
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

export default TitleDescriptionForm;
