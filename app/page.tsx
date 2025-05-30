"use client";
import FullPageLoad from "@/components/custom/full-page-load";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Page() {
  const route = useRouter();
  useEffect(() => {
    route.push("/home");
  });

  return <FullPageLoad />;
}

export default Page;
