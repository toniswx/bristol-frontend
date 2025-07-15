"use client";
dotenv.config();
import * as dotenv from "dotenv";

import ProfileCard from "@/components/custom/profile-card";
import { UserWithoutProperties } from "@/types";

import { useParams } from "next/navigation";
import React from "react";
import UserPosts from "@/components/custom/filtro-pesquisa";
import { useQuery } from "@tanstack/react-query";
import ProfileCardSkeleton from "@/components/custom/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const params = useParams();

  const getPublicUserData = async (): Promise<UserWithoutProperties | null> => {
    try {
      const response = await fetch(`http://localhost:5000/users/${params.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle HTTP errors (404, 500, etc.)
      if (!response.ok) {
        if (response.status === 404) {
          // Return null or undefined instead of throwing
          return null; // or return null;
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicUserData"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay
      return getPublicUserData();
    },
  });

  if (isLoading)
    return (
      <div className=" flex items-center justify-center flex-col">
        <div className=" w-11/12 flex items-start justify-start gap-x-2">
          <div>
            <ProfileCardSkeleton />
          </div>
          <div className=" w-full">
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
          </div>
        </div>
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>User not found</div>;

  return (
    <div className=" flex items-center justify-center flex-col">
      <div className=" w-11/12 flex items-start justify-start gap-x-2">
        <div>
          <ProfileCard data={data} />
        </div>
        <div className=" w-full">
          <div className="w-full">
            <UserPosts buttonsQuantity={data.imoveisTotalLenght} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
