import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRightCircle, HouseIcon, Settings, User2Icon } from "lucide-react";

export function UserDropDownMenu(props: { data: Partial<User> }) {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Logout failed");
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log("logout successful:", data);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("logout error:", error);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{props.data.username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/user/${props.data.id}`}>
            {" "}
            <DropdownMenuItem>
              Perfil
              <DropdownMenuShortcut>
                <User2Icon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem>
            Meus anúncios
            <DropdownMenuShortcut>
              <HouseIcon size={14} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
            <DropdownMenuShortcut>
              <Settings />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem>Suporte</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutation.mutate()}>
          Sair
          <DropdownMenuShortcut>
            <ArrowRightCircle />{" "}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
