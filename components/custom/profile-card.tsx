import { User, UserWithoutProperties } from "@/types";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  CalendarRange,
  EllipsisIcon,
  MapPinHouseIcon,
  MessageCircle,
  Phone,
  UserCircleIcon,
  Verified,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ProfileCard(props: { data: UserWithoutProperties }) {
  function formatBrazilianDateTime(isoString: Date) {
    try {
      return new Date(isoString).toLocaleString("pt-BR", { year: "numeric" });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Data inválida";
    }
  }
  return (
    <div className="w-80 border  rounded-md flex items-start  flex-col  py-5 px-3 gap-2 ">
      <div className=" w-full flex items-start justify-between">
        {" "}
        <div className="flex items-start justify-start flex-col gap-y-1 ">
          <p className=" text-xs text-muted-foreground">Perfil pessoal</p>
          <div className="flex items-center justify-items-center ">
            <UserCircleIcon width={15} />
            <p className="line-clamp-1 font-semibold text-sm pl-1">
              {props.data.username}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="">
                    <Verified
                      width={13}
                      className="relative top-[1.9px] ml-1 text-purple-800"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Conta verificada</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-start">
            <CalendarRange width={15} />
            <p className="text-xs line-clamp-1 font-light  pl-1">
              Cadastrado desde {formatBrazilianDateTime(props.data.createdAt)}
            </p>
          </div>
          <div className="flex items-center justify-start">
            <MapPinHouseIcon width={15} />
            <p className="text-xs line-clamp-1 font-light  pl-1">
              {props.data.userDetail?.state} - {props.data.userDetail?.city} -{" "}
              {props.data.userDetail?.street}
            </p>
          </div>
        </div>
        <div className="h-full  ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-5 h-5 cursor-pointer"
              >
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Denunciar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />

      <div className="w-full space-y-2">
        <p className="text-sm font-semibold">Entre em contato</p>
        <div className="flex items-center justify-between w-full gap-1">
          <Button className="bg-green-700 w-1/2">
            Whatsapp <Phone />
          </Button>
          <Button className="w-1/2" variant={"outline"}>
            Chat <MessageCircle />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
