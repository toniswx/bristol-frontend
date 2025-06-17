"use client";

import LocationFilter from "@/components/custom/estate-filter2";
import Filter from "@/components/custom/Filter";
import React from "react";
import PreviewCard from "@/components/custom/preview-card";
import { CookieConsent } from "@/components/cookie-consent";

function Page() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className=" flex items-start justify-center  p-6 h-full  w-4/6">
       <CookieConsent
      variant="minimal"
      onAcceptCallback={() => {
        // Handle accept
      }}
      onDeclineCallback={() => {
        // Handle decline
      }}
    />
        <div className="w-2/6 ">
          <Filter />
        </div>
        <div className=" h-full w-full flex items-start justify-start mx-3 flex-col space-y-3 ">
          <LocationFilter />
          <div className="p-2 text-lg">
            {" "}
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Imóveis à venda
            </h2>
            <p className="text-xs font-normal text-muted-foreground">
              11.278 resultados
            </p>
          </div>
          <div className="w-full">
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
