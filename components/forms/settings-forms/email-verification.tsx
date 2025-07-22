import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { User } from "@/types";

function EmailVerification({ userData }: { userData: User }) {
  const verifyEmailSchema = z.object({
    emailVerificationCode: z.string().jwt({message:"Código de verificação inválido, tente novamente."}),
  });

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      emailVerificationCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof verifyEmailSchema>) {
    alert(values);
    
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="emailVerificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de confirmação</FormLabel>
                  <FormDescription>
                    Digite o código de verificação que chegou ao email associado
                    a essa conta.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="" {...field} className="" type="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-start gap-x-1">
              <Button disabled={!form.formState.isDirty}>Confirmar</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EmailVerification;
