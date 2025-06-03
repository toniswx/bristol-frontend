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
  CircleFadingArrowUpIcon,
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
      },
      {
        title: "Informe a localização do imóvel",
        formDescription:
          "Comece digitando o CEP para preencher automaticamente o endereço.",
        helpText:
          "Verifique se os dados estão corretos. Você pode ajustar manualmente se necessário.",
        formId: "LocationForm",
        form: <LocationForm key={"LocationForm"} />,
      },
      {
        title: "Detalhes do imóvel",
        formDescription:
          "Preencha todas as características específicas do seu imóvel",
        helpText:
          "Quanto mais informações precisas você fornecer, melhores serão os resultados do seu anúncio",
        formId: "DetailForm",
        form: <DetailForm key={"DetailForm"} />,
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
      },
      {
        title: "Revise seu anúncio",
        formDescription:
          "Confira todas as informações antes de publicar, verifique cuidadosamente cada detalhe para garantir a qualidade do seu anúncio",
        helpText: "Você pode voltar clicando no bloco onde deseja editar.",
        formId: "ResumeForm",
        form: <Resume key={"ResumeForm"} />,
      },
    ];
  };
  const totalLength = f().length;

  const currentStep = formState.formStep + 1;

  const x = (currentStep / totalLength) * 100;

  return (
    <div className="w-full min-h-screen flex items-center justify-start flex-col">
      <Progress value={x} />{" "}
      <div className="w-1/2 ">
        <div className="w-full flex justify-center items-center flex-col  p-4 ">
          <div className="w-full mb-2 space-y-1 ">
            <h2 className="text-lg  font-semibold">
              {f()[formState.formStep].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {" "}
              {f()[formState.formStep].formDescription}
            </p>
            <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-blue-300 dark:border-blue-600/70">
              {" "}
              <CircleFadingArrowUpIcon className="h-4 w-4 !text-blue-500" />{" "}
              <AlertTitle>{f()[formState.formStep].helpText}</AlertTitle>{" "}
            </Alert>
            {f()[formState.formStep].imageHelperText && (
              <Alert className="bg-emerald-500/10 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-600/70">
                {" "}
                <CircleFadingArrowUpIcon className="h-4 w-4 !text-emerald-500" />{" "}
                <AlertTitle>
                  {f()[formState.formStep].imageHelperText}
                </AlertTitle>{" "}
              </Alert>
            )}
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
