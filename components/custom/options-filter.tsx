"use client";

import { Label } from "@radix-ui/react-label";
import { Checkbox } from "../ui/checkbox";

const propertyDetails = [
  {
    id: "academia",
    label: "Academia",
  },
  {
    id: "aquecimento",
    label: "Aquecimento",
  },
  {
    id: "ar-condicionado",
    label: "Ar condicionado",
  },
  {
    id: "area-de-servico",
    label: "Área de serviço",
  },
  {
    id: "armarios-cozinha",
    label: "Armários na cozinha",
  },
  {
    id: "armarios-quarto",
    label: "Armários no quarto",
  },
  {
    id: "banheiro-quarto",
    label: "Banheiro no quarto",
  },
  {
    id: "churrasqueira",
    label: "Churrasqueira",
  },
  {
    id: "internet",
    label: "Internet",
  },
  {
    id: "mobiliado",
    label: "Mobiliado",
  },
  {
    id: "piscina",
    label: "Piscina",
  },
  {
    id: "porteiro-24h",
    label: "Porteiro 24h",
  },
  {
    id: "quarto-servico",
    label: "Quarto de serviço",
  },
  {
    id: "salao-festas",
    label: "Salão de festas",
  },
  {
    id: "tv-cabo",
    label: "Tv a cabo",
  },
  {
    id: "varanda",
    label: "Varanda",
  },
] as const;

export function CheckBoxOptions() {
  return (
    <div className="grid grid-cols-1 space-y-2">
      <h2 className=" font-semibold text-sm text-muted-foreground">
        Detalhes do imóvel
      </h2>
      {propertyDetails.map((item) => {
        return (
          <div key={item.id} className="">
            <Label className=" flex items-center justify-start space-x-2 w-full  px-1 hover:bg-accent cursor-pointer">
              <Checkbox id={item.id} />
              <p className="text-sm">{item.label}</p>
            </Label>
          </div>
        );
      })}
    </div>
  );
}
