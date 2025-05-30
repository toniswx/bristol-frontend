"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import LoginForm from "../forms/login";

import Logo from "./logo";
import { NavigationCustom } from "./customnavigation";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../AuthWrapper";
import { UserDropDownMenu } from "./user-menu";
import Link from "next/link";

function Navbar() {
  const query = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
  });

  const route = useRouter();

  const handleRouteToSingUp = () => {
    route.push("/singup");
  };

  return (
    <div className="flex items-center justify-around  my-6">
      <Logo />
      <div className="flex items-center justify-center ">
        <NavigationCustom />
      </div>

      <div>
        {" "}
        {query.data?.id ? (
          <div className="gap-x-2 flex">
            <UserDropDownMenu data={query.data} />
            <Link href={"/novo-anuncio"}>
              <Button size={"sm"}>Novo anuncio</Button>
            </Link>
          </div>
        ) : (
          <div className="">
            <Dialog>
              <DialogTrigger asChild className="self-end">
                <Button className="cursor-pointer " variant={"secondary"}>
                  Entrar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Acesse sua conta com seu email e senha
                  </DialogDescription>
                </DialogHeader>
                <LoginForm />
              </DialogContent>
            </Dialog>
            <Button
              size={"sm"}
              className=""
              variant={"default"}
              onClick={() => {
                handleRouteToSingUp();
              }}
            >
              Criar conta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
