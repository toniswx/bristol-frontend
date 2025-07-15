"use client";
import React, { useRef, useState } from "react";
import { data } from "./estate-filter";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Locate, MapPin, Pin, PinIcon } from "lucide-react";
import { Button } from "../ui/button";

function LocationFilter() {
  
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const inputSearchLocationRef = useRef<HTMLInputElement>(null);

  return (
    <div className=" border z-50 p-2 w-full rounded-md flex items-center justify-center space-x-1  ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              size={"icon"}
              className="cursor-pointer"
            >
              <Locate />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Usar localização</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="relative w-full">
        <Input
          value={selectedLocation || searchValue}
          className=""
          ref={inputSearchLocationRef}
          placeholder="Procure um estado ou cidade"
          onChange={() => {
            setSearchValue(inputSearchLocationRef.current!.value);
            setSelectedLocation(""); // Clear selected location when typing
          }}
        />

        <div
          className={
            selectedLocation === ""
              ? "flex items-start justify-center flex-col absolute bg-white w-full px-2"
              : "bg-amber-700 "
          }
        >
          {searchValue && (
            <ScrollArea className="h-[190px] absolute   w-full border px-2 ">
              <div className="">
                <p className="text-muted-foreground font-semibold px-1">
                  Estados
                </p>
                {searchValue.trim() !== ""
                  ? (() => {
                      const results = data
                        .filter((i) =>
                          i.name
                            .toLowerCase()
                            .includes(searchValue.toLocaleLowerCase())
                        )
                        .map((i) => ({
                          state: i,
                        }));

                      if (results.length === 0) {
                        return (
                          <div className="text-sm text-muted-foreground px-2 py-3">
                            Nenhum resultado encontrado.
                          </div>
                        );
                      }

                      return results.map(({ state }, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedLocation(state.name);
                            setSearchValue(""); // Clear search value when a location is selected
                          }}
                          className="cursor-pointer hover:bg-accent flex items-center justify-start"
                        >
                          <MapPin size={15} className="text-muted-foreground" />
                          <p className="text-xs py-2 px-1 text-muted-foreground">
                            {state.name}
                          </p>
                        </div>
                      ));
                    })()
                  : null}
                <p className="text-muted-foreground font-semibold px-1">
                  Cidades
                </p>

                {searchValue.trim() !== ""
                  ? (() => {
                      const results = data.flatMap((i) =>
                        i.municipios
                          .filter((x) =>
                            x.toLowerCase().includes(searchValue.toLowerCase())
                          )
                          .map((city) => ({
                            city,
                            state: i.name,
                          }))
                      );

                      if (results.length === 0) {
                        return (
                          <div className="text-sm text-muted-foreground px-2 py-3">
                            Nenhum resultado encontrado.
                          </div>
                        );
                      }

                      return results.map(({ city, state }, index) => (
                        <div
                          key={index}
                          className="flex cursor-pointer hover:bg-accent justify-start items-center"
                          onClick={() => {
                            setSelectedLocation(`${city} - ${state}`);
                            setSearchValue("");
                          }}
                        >
                          <Pin size={15} className="text-muted-foreground" />
                          <p className="text-xs py-2 px-1 t">
                            {city} -{" "}
                            <span className="font-semibold text-muted-foreground">
                              {state}
                            </span>
                          </p>
                        </div>
                      ));
                    })()
                  : null}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationFilter;
