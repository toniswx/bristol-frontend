"use client";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import FullPageLoad from "../custom/full-page-load";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  CircleAlertIcon,
  CircleUserRoundIcon,
  ImageUpIcon,
  XIcon,
} from "lucide-react";
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

import { useFileUpload } from "@/hooks/use-file-upload";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalido" }),
 
});
function PasswordRecoveryForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    
    },
  });

  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [cepLoad, setCepLoad] = useState<boolean>(false);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

 

  async function onSubmit(values: z.infer<typeof formSchema>) {
  
  }

  



  return (
    <div className="w-full flex items-center justify-center ">
      {isLoading ? (
        <FullPageLoad />
      ) : (
        <div className=" w-full space-y-7">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              <div className="space-y-3 ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="my-3"
                variant={"default"}
                onClick={() => {}}
              >
                Recuperar conta
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default PasswordRecoveryForm;
