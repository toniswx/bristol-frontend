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
  UserCircleIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

function ProfileCardSkeleton() {
  return (
    <div className="w-80 border  rounded-md flex items-start  flex-col  py-5 px-3 gap-2 ">
      <div className=" w-full flex items-start justify-between">
        {" "}
        <div className="flex items-start justify-start flex-col gap-y-1 ">
          <Skeleton className="w-[220px] h-[20px] rounded-md" />
          <div className="flex items-center justify-items-center space-x-1 ">
            <UserCircleIcon width={15} />
            <Skeleton className="w-[90px] h-[20px] rounded-md" />{" "}
            <Skeleton className="w-[20px] h-[20px] rounded-md" />{" "}
            <Skeleton className="w-[60px] h-[20px] rounded-md" />{" "}
          </div>

          <div className="flex items-center justify-items-center space-x-1">
            <CalendarRange width={15} />
            <Skeleton className="w-[30px] h-[20px] rounded-md" />{" "}
            <Skeleton className="w-[40px] h-[20px] rounded-md" />{" "}
            <Skeleton className="w-[60px] h-[20px] rounded-md" />{" "}
          </div>
          <div className="flex items-center justify-start space-x-1">
            <MapPinHouseIcon width={15} />
            <Skeleton className="w-[90px] h-[20px] rounded-md" />{" "}
            <Skeleton className="w-[10px] h-[20px] rounded-md" />{" "}
            <Skeleton className="w-[50px] h-[20px] rounded-md" />{" "}
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
        <Skeleton className="w-1/3 h-[20px] rounded-md" />
        <div className="flex items-center justify-start w-full gap-1">
          <Skeleton className="w-1/2 h-[20px] rounded-md" />{" "}
          <Skeleton className="w-1/2 h-[20px] rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default ProfileCardSkeleton;
