import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Bath,
  BathIcon,
  Bed,
  Car,
  PinIcon,
  PinOff,
  Scale3DIcon,
  Scaling,
  SquareMousePointer,
} from "lucide-react";

function PreviewCard() {
  return (
    <div className="w-full h-48 border   flex items-center justify-center  hover:bg-muted rounded-md">
      <div className="w-2/6  h-full flex items-center justify-center">
        <Image
          src={"https://img.olx.com.br/images/86/866541523106175.webp"}
          width={700}
          height={700}
          alt="imagem do anuncio"
          className=" h-full w-full object-cover p-0  rounded-md rounded-r-none"
        />
      </div>
      <div className="w-4/6  h-full p-3 flex flex-col justify-between cursor-pointer">
        <div className="space-y-2">
          {" "}
          <h2 className=" font-semibold">
            Casa à venda no MARIO LEHAY, BARRO DURO, Maceió, AL
          </h2>
          <div className="flex items-center justify-start space-x-2">
            <div className="items-center justify-center flex  w-fit text-muted-foreground space-x-1">
              <Bed size={16} className="" />
              <p className="text-xs"> 2</p>
            </div>
            <div className="items-center justify-center flex  w-fit text-muted-foreground space-x-1">
              <Car size={16} className="" />
              <p className="text-xs"> 2</p>
            </div>
            <div className="items-center justify-center flex  w-fit text-muted-foreground space-x-1">
              <BathIcon size={16} className="" />
              <p className="text-xs"> 2</p>
            </div>
            <div className="items-center justify-center flex  w-fit text-muted-foreground space-x-1">
              <Scaling size={16} className="" />
              <p className="text-xs"> 190m²</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center text-muted-foreground space-x-1">
            <PinIcon size={16} />
            <p className="text-xs text-muted-foreground">
              Ponta Grossa - Maceió, AL
            </p>
          </div>
          <p className="text-2xl font-bold text-muted-foreground">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(20000)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PreviewCard;
