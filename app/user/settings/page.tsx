"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRightIcon,
  Eclipse,
  Lock,
  Menu,
  Shield,
  User,
} from "lucide-react";
import ProfileForm from "@/components/forms/settings-forms/profile-form";
import { useQuery } from "@tanstack/react-query";
import Logo from "@/components/custom/logo";
import { useUserStore } from "@/lib/stores/currentUserStore";
import { Button } from "@/components/ui/button";
import SecurityForm from "@/components/forms/settings-forms/security-form";
import DetailForm from "@/components/post-form/detail";
import DetailFormProfile from "@/components/forms/settings-forms/detail-form";

function page() {
  const { isLoadingError, isLoading, currentUser } = useUserStore();

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center  justify-center ">
        <Logo />
      </div>
    );
  if (isLoadingError?.message === "Too many requests")
    return (
      <div className="w-full h-screen flex items-center  justify-center flex-col gap-y-5">
        <h1 className="text-5xl">⚠️ Muitas Solicitações </h1>
        <p>
          Você fez muitas requisições em um curto período. Por favor, aguarde
          alguns instantes e tente novamente.
        </p>
        <Button>voltar para home</Button>
      </div>
    );

  if (currentUser === "NOT FOUND")
    return (
      <div className="w-full h-screen flex items-center  justify-center flex-col gap-y-5">
        <h1 className="text-5xl">Usuário não encontrado </h1>
        <p>As informações não foram encontradas no nosso servidor.</p>
        <Button>Voltar para home</Button>
      </div>
    );

  if (currentUser === null)
    return (
      <div className="w-full h-screen flex items-center  justify-center ">
        <Logo />
      </div>
    );

  return (
    <div className="w-full  h-screen flex items-center  flex-col justify-start">
      <div className="w-2/3 h-2/3 my-10  flex items-center gap-x-2 p-2 rounded-md  ">
        <Tabs
          defaultValue="tab-1"
          orientation="vertical"
          className="w-full h-full flex-row "
        >
          <TabsList className="flex-col rounded-none h-full bg-transparent justify-start p-0">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <div className="flex items-center justify-start w-full space-x-1">
                <span>Perfil</span>{" "}
                <span>
                  <User size={13} />{" "}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <div className="flex items-center justify-start w-full space-x-1">
                <span>Segurança</span>{" "}
                <span>
                  <Shield size={13} />{" "}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="data-[state=active]:after:bg-primary relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <div className="flex items-center justify-start w-full space-x-1">
                <span>Detalhes</span>{" "}
                <span>
                  <Menu size={13} />{" "}
                </span>
              </div>
            </TabsTrigger>
          </TabsList>
          <div className="grow rounded-md  text-start h-full">
            <TabsContent
              value="tab-1"
              className="h-full w-full flex items-center justify-center"
            >
              <ProfileForm userData={currentUser} />
            </TabsContent>
            <TabsContent
              value="tab-2"
              className="h-full w-full flex items-center justify-center"
            >
              <SecurityForm userData={currentUser} />
            </TabsContent>
            <TabsContent value="tab-3">
              <DetailFormProfile userData={currentUser} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default page;
