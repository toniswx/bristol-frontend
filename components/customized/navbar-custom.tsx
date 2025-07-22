"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logo from "../custom/logo";
import { Loader2, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UserMenu from "../navbar-components/user-menu";

import LoginForm from "../forms/login";
import NotificationMenu from "../navbar-components/notification-menu";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { useUserStore } from "@/lib/stores/currentUserStore";
// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [{ href: "/home", label: "Home", active: true }];

export default function CustomNavBar() {
  const userData = useUserStore((state) => state.currentUser);
  const setNull = useUserStore((state) => state.setNull);

  const isLoadingUserData = useUserStore((state) => state.isLoading);

  if (userData === "NOT FOUND") {
    setNull(null);

    return <></>;
  }

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5"
                        active={link.active}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 40 40"
            >
              <path
                fill="#F06225"
                d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"
              ></path>
              <path
                fill="#F06225"
                d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
              ></path>
            </svg>
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={link.active}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center justify-between  rounded-md border py-1  px-3 gap-x-4">
          {userData?.id ? <NotificationMenu /> : null}
          {userData?.id ? (
            <UserMenu userdata={userData} />
          ) : (
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Entrar</Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <Logo />
                    </div>
                    <DialogHeader>
                      <DialogTitle className="sm:text-center">
                        Bem vindo de volta
                      </DialogTitle>
                      <DialogDescription className="sm:text-center">
                        Use suas credenciais para acessar sua conta.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <LoginForm />
                </DialogContent>
              </Dialog>

              <Button asChild size={"sm"} className="" variant={"default"}>
                <a href="/singup"> Criar conta</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
