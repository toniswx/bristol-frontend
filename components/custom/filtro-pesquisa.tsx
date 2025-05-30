import React, { useState } from "react";
import { Input } from "../ui/input";
import { BadgeAlert, Frown, Search } from "lucide-react";
import { Imovel, PaginationInfo } from "@/types";
import PreviewCard from "./preview-card";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import page from "@/app/singup/page";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
function UserPosts(props: { buttonsQuantity: number }) {
  const quantity = Math.ceil(props.buttonsQuantity / 10);

  const params = useParams();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(0);
  const [postsViewed, setPostsViewed] = useState(0);

  const getUserPosts = async (
    page: number
  ): Promise<{
    properties: Imovel[];
    totalCount: number;
    paginationInfo: PaginationInfo;
  }> => {
    setCurrentPage(page);

    try {
      const response = await fetch(
        `http://localhost:5000/users/${params.id}/${page}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      return data;
    } catch (err) {
      throw err;
    }
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userPosts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay
      return getUserPosts(0);
    },
  });

  const mutation = useMutation({
    mutationFn: getUserPosts,
    onSuccess: (data) => {
      setPostsViewed((oldvalue) => oldvalue + data.properties.length);
      queryClient.setQueryData(["userPosts"], data);
    },
    onError: (error) => {},
  });

  if (isLoading)
    return (
      <div className="w-full px-4">
        <div className="flex items-center justify-start space-x-1">
          <Skeleton className="w-[100px] h-[20px] rounded-md" />
        </div>
        <p className="text-muted-foreground text-sm"></p>

        <div className="grid-cols-5 grid gap-3 my-4 ">
          {Array.from({ length: 10 }).map((item, index) => {
            return (
              <div
                key={index}
                className="border cursor-pointer hover:bg-accent"
              >
                <div>
                  <Skeleton className="w-full h-[80px] " />
                </div>
                <div className="p-2">
                  <Skeleton className="w-[100px] h-[20px] " />
                </div>
                <div className="p-2">
                  <Skeleton className="w-[60px] h-[5px] " />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  if (data)
    return (
      <div className="w-full px-4  r">
        <div className="flex items-center justify-start space-x-1">
          <h2 className="text-lg font-semibold">Anúncios</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="">
                  <BadgeAlert
                    width={13}
                    className="relative top-[1.9px] ml-1 text-purple-800"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                São todos os anúncios ativos do usuário.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground text-sm">
          {data.paginationInfo.lastItemOnPage} de {data.totalCount} anúncios
          publicados
        </p>
        <div className="border rounded-md mt-2 p-2 w-full ">
          {data.totalCount === 0 ? (
            <div className="flex items-center justify-center w-full h-96 ">
              <h2 className="mx-2">Nenhum anúncio publicado.</h2>
            </div>
          ) : (
            ""
          )}
          {data.totalCount === 0 ? (
            ""
          ) : (
            <div className="relative flex items-center justify-start my-4 ">
              <Search
                className="absolute ml-2 text-muted-foreground"
                size={15}
              />
              <Input className="pl-8" placeholder="Ex: Casa de praia" />
            </div>
          )}
          <div className="grid-cols-5 grid gap-3 my-4 ">
            {data &&
              data.properties.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="border cursor-pointer hover:bg-accent"
                  >
                    <div>
                      <Image
                        src={
                          "https://img.olx.com.br/images/86/866541523106175.webp"
                        }
                        width={700}
                        height={300}
                        alt="imagem do anuncio"
                        className=" h-full w-full object-cover p-0  rounded-md rounded-r-none"
                      />
                    </div>
                    <div className="p-2">
                      <p className="line-clamp-1  text-md text-muted-foreground cursor-pointer font-semibold">
                        {item.title}
                      </p>

                      <h2 className="text-xs font-semibold">
                        {" "}
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                      </h2>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex items-center justify-center w-full ">
            <Pagination>
              <PaginationContent>
                {Array.from({ length: quantity }, (_, index) => (
                  <PaginationItem
                    key={index}
                    className={
                      index === currentPage
                        ? "cursor-pointer border rounded-md text-muted-foreground "
                        : "cursor-pointer border rounded-md bg-accent "
                    }
                    onClick={() => {
                      if (currentPage === index) return;
                      if (isLoading) return;
                      mutation.mutate(index);
                    }}
                  >
                    <PaginationLink>{index + 1}</PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    );
}

export default UserPosts;

/*  <div className="relative flex items-center justify-start my-4 ">
        <Search className="absolute ml-2 text-muted-foreground" size={15} />
        <Input className="pl-8" placeholder="Ex: Iphone 16" />
      </div>
      <div className="w-full flex items-center justify-center border rounded-md p-5 ">
        <div className="grid grid-cols-2 gap-2">
          {props.imovel &&
            props.imovel.map((imovel) => {
              return <PreviewCard key={imovel.id} />;
            })}
        </div>
        {props.imovel.length === 0 ? (
          <div className="flex items-center justify-center">
            <h2 className="mx-2">Nenhum anúncio publicado.</h2>
            <Frown size={15} />
          </div>
        ) : (
          ""
        )}
      </div>*/
