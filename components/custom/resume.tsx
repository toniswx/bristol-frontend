"use client";
import { useFormState } from "@/lib/stores/formStore";
import React, { useEffect } from "react";
import ImageCarousel from "./images-carrousel";
import { Image, ImageMinus } from "lucide-react";

function Resume() {
  const formState = useFormState();

  useEffect(() => {
    console.log(formState.form);
  }, []);
  return (
    <div className="w-full h-1/2 p-2">
      <div className="flex items-center justify-center h-full gap-1">
        <div className="space-y-2 h-full grid grid-cols-2 gap-2  ">
          <div
            className=" p-2 px-4 col-span-2 border h-full rounded-md hover:bg-accent cursor-pointer "
            onClick={() => {
              formState.setChooseStepToGo(0);
            }}
          >
            <h2 className="font-bold">{formState.form.title}</h2>
            <p
              className="text-xs my-2"
              dangerouslySetInnerHTML={{
                __html: formState.form.textDescription,
              }}
            ></p>
          </div>

          <div
            onClick={() => {
              formState.setChooseStepToGo(1);
            }}
            className=" p-2 px-4 border   w-full  h-full  rounded-md hover:bg-accent cursor-pointer"
          >
            <h2 className="font-semibold my-2 ">Endereço</h2>
            <div className="text-xs">
              <p>CEP : {formState.form.CEP}</p>
              <p>Cidade :{formState.form.city}</p>
              <p>Estado : {formState.form.estate}</p>
              <p>Complemento : {formState.form.log}</p>
              <p>Rua / Avenida : {formState.form.street}</p>
            </div>
          </div>

          <div
            onClick={() => {
              formState.setChooseStepToGo(2);
            }}
            className=" p-2 px-4 border  w-full  rounded-md hover:bg-accent cursor-pointer "
          >
            <h2 className="font-semibold my-2 ">Detalhes</h2>

            <div className="text-xs">
              <p>Preço : {formState.form.price}</p>
              <p>IPTU :{formState.form.IPTU}</p>
              <p>Área : {formState.form.area}</p>
              <p>Banheiros : {formState.form.bathrooms}</p>
              <p>Quartos: {formState.form.bedrooms}</p>
              <p>Vagas de garagem : {formState.form.garage}</p>
              <p>Salas / Escritórios : {formState.form.rooms}</p>
            </div>
          </div>
        </div>

        <div
          className=" h-full border   hover:bg-muted cursor-pointer"
          onClick={() => {
            formState.setChooseStepToGo(3);
          }}
        >
          <ImageCarousel />
        </div>
      </div>
    </div>
  );
}

export default Resume;
