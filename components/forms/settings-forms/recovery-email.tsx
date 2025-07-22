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

function RecoveryEmail({ userData }: { userData: User }) {
  const recoveryEmailSchema = z.object({
    recoveryEmail: z.string().email(),
  });

  const form = useForm<z.infer<typeof recoveryEmailSchema>>({
    resolver: zodResolver(recoveryEmailSchema),
    defaultValues: {
      recoveryEmail: "",
    },
  });

  async function onSubmit(values: z.infer<typeof recoveryEmailSchema>) {
    alert(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="recoveryEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de recuperação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      {...field}
                      className=""
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-start gap-x-1">
              <Button disabled={!form.formState.isDirty}>Salvar</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default RecoveryEmail;
