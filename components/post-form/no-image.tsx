import { Frown } from "lucide-react";
import React from "react";

function NoImageSelected() {
  return (
    <div className=" h-44 w-full flex items-center justify-center gap-x-2">
      <h2 className="text-sm">Nenhuma imagem selecionada </h2>
      <Frown />
    </div>
  );
}

export default NoImageSelected;
