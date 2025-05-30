import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

function NotFoundCustom() {
  return (
    <div className=" space-x-4 w-full h-screen flex-col overflow-hidden flex items-center justify-center">
      <div className="space-y-5">
        <h2 className="text-5xl">Página não encontrada 😔 </h2>
        <Link href={"/"}>
          <Button> Voltar a página inicial </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundCustom;
