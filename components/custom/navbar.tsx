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
import { UserDropDownMenu } from "./user-menu";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/currentUserStore";

function Navbar() {
  const userData = useUserStore((state) => state.currentUser);
  const isLoadingUserData = useUserStore((state) => state.isLoading);



  return (
    <div className="flex items-center justify-around  my-6">
      <Logo />
      <div className="flex items-center justify-center ">
        <NavigationCustom />
      </div>

      <div>
        {isLoadingUserData}
        {userData?.email}
        {userData?.id ? (
          <div className="gap-x-2 flex">
            <UserDropDownMenu data={userData} />
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
              onClick={() => {}}
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
