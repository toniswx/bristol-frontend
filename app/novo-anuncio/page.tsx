"use client";
import Resume from "@/components/custom/resume";
import DetailForm from "@/components/post-form/detail";
import ImagesForm from "@/components/post-form/images";
import LocationForm from "@/components/post-form/location-form";
import TitleDescriptionForm from "@/components/post-form/title-desc";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFormState } from "@/lib/stores/formStore";
import { DndContext } from "@dnd-kit/core";
import {
  BookUser,
  CircleFadingArrowUpIcon,
  ImagePlus,
  ListChecks,
  MapPinned,
  NotebookPen,
  OctagonAlert,
  ShieldAlert,
} from "lucide-react";
import React, { useState } from "react";

function Page() {
  const formState = useFormState();

  const f = () => {
    return [
      {
        title: "Começe criando um título e uma descrição",
        formDescription:
          "Adicione um título atrativo e descreva todos os detalhes relevantes.",
        helpText:
          "  Um bom anúncio contém todas as características do imóvel e destaca seus pontos fortes de forma clara e honesta.",
        formId: "TitleForm",

        form: <TitleDescriptionForm key={"TitleForm"} />,
        icon: <NotebookPen />,
      },
      {
        title: "Informe a localização do imóvel",
        formDescription:
          "Comece digitando o CEP para preencher automaticamente o endereço.",
        helpText:
          "Verifique se os dados estão corretos. Você pode ajustar manualmente se necessário.",
        formId: "LocationForm",
        form: <LocationForm key={"LocationForm"} />,
        icon: <MapPinned />,
      },
      {
        title: "Detalhes do imóvel",
        formDescription:
          "Preencha todas as características específicas do seu imóvel",
        helpText:
          "Quanto mais informações precisas você fornecer, melhores serão os resultados do seu anúncio",
        formId: "DetailForm",
        form: <DetailForm key={"DetailForm"} />,
        icon: <ListChecks />,
      },
      {
        title: "Adicione fotos do imóvel",
        formDescription:
          "Mostre seu imóvel da melhor forma com fotos de qualidade",
        helpText:
          "Envie no mínimo 4 fotos. A primeira foto será a capa do anúncio.",
        imageHelperText: "Arraste as fotos para mudar a ordem.",

        formId: "ImagesForm",
        form: <ImagesForm key={"ImagesForm"} />,
        icon: <ImagePlus />,
      },
      {
        title: "Revise seu anúncio",
        formDescription:
          "Confira todas as informações antes de publicar, verifique cuidadosamente cada detalhe para garantir a qualidade do seu anúncio",
        helpText: "Você pode voltar clicando no bloco onde deseja editar.",
        formId: "ResumeForm",
        form: <Resume key={"ResumeForm"} />,
        icon: <BookUser />,
      },
    ];
  };
  const totalLength = f().length;

  const currentStep = formState.formStep + 1;

  const x = (currentStep / totalLength) * 100;

  return (
    <div className="w-full min-h-screen flex items-center justify-start flex-col">
      <Progress value={x} />{" "}
      <div className="w-full flex items-start justify-start  p-30 py-2  ">
        <div className="w-96 h-full space-y-2 p-4 "></div>
        <div className="w-1/2 flex justify-center items-center flex-col   p-4 ">
          <div className="w-full mb-2 space-y-1 ">
            <div className="flex items-center justify-start space-x-2">
              <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
                {f()[formState.formStep].title}{" "}
              </h1>
            </div>
            <p className="text-muted-foreground text-md">
              {" "}
              {f()[formState.formStep].formDescription}
            </p>
          </div>

          <div className="w-full mt-1">
            <DndContext>{f()[formState.formStep].form}</DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
