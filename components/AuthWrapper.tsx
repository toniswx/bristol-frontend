"use client";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useQuery({ queryKey: ["userData"], queryFn: getUserData });

  return <>{children}</>;
}

export const getUserData = async (): Promise<User | undefined> => {
  try {
    const post = await fetch("http://localhost:5000/auth", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!post) return;
    const data: User = await post.json();

    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};
