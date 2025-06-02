import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { createClient } from "@supabase/supabase-js";

import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../AuthWrapper";
import {
  ArrowLeft,
  ArrowRight,
  CircleFadingArrowUpIcon,
  InfoIcon,
  MoreVerticalIcon,
  OctagonAlert,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { FormLabel } from "../ui/form";
import { useFormState } from "@/lib/stores/formStore";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { setErrorMap } from "zod";
import Image from "next/image";
import { Main } from "../dnd/main";
import { DndContext } from "@dnd-kit/core";
import { Droppable } from "../dnd/droppable";
import { Draggable } from "../dnd/draggable";

type previewImage = { image: string; col: string; id: string };

function ImagesForm() {
  const formState = useFormState();

  const [activeId, setActiveId] = useState<string | null>(null);

  const [colsCounter, setColsCounter] = useState<number>(0);
  const [cols, setCols] = useState<{ id: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>(
    formState.form.photoFiles ? formState.form.photoFiles : []
  );
  const [error, setError] = useState<boolean>(false);

  const [previewImages, setPreviewImages] = useState<previewImage[]>(
    formState.form.photoURLPREVIEW ? formState.form.photoURLPREVIEW : []
  );

  const inputImageRef = useRef<HTMLInputElement>(null);

  const sendPicturesToFormState = () => {
    if (imageFiles.length < 4) {
      return;
    } else {
      formState.setFormData({ photoURLPREVIEW: [...previewImages] });
      formState.setFormData({ photoFiles: [...imageFiles] });

      formState.setFormStep();
    }
  };

  const handleNext = () => {
    if (imageFiles.length < 4) {
      setError(true);
    }
    sendPicturesToFormState();
  };
  const handleGoBack = () => formState.setGoBackOneStep();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = files[0];
      const url = URL.createObjectURL(image);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          console.log(`Dimensions: ${img.width}x${img.height}`);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(image);

      setImageFiles((oldValue) => [...oldValue, image]);

      const imagePreviewObject = {
        image: url,
        col: `col-${colsCounter}`,
        id: url,
      };

      setPreviewImages((oldValue) => [...oldValue, imagePreviewObject]);
      handleAddImageInCols({ id: `col-${colsCounter}` });
      handleColCounter();
    }
  };

  const handleColCounter = () => {
    setColsCounter((prev) => prev + 1);
  };
  const handleAddImageInCols = (colData: { id: string }) => {
    setCols((oldValue) => [...oldValue, colData]);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  function handleDragEnd({ over }) {
    if (over === null) return;
    const targetItem = previewImages.filter((i) => i.id === activeId);
    const newArr = previewImages.filter((i) => i.id !== activeId);
    const oldCol = targetItem[0].col;
    const swapItem = newArr.find((item) => item.col === over.id);
    if (!swapItem) return;
    swapItem.col = oldCol;
    targetItem[0].col = over.id;
    setPreviewImages([...newArr, targetItem[0]]);

    console.log(previewImages);
  }

  return (
    <div>
      <div className="w-full ">
        <div className="w-full  ">
          <Label
            className={
              error
                ? "flex flex-col items-center justify-center h-full  p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 "
                : "flex flex-col items-center justify-center h-full p-2  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            }
          >
            <div className="flex flex-col items-center justify-center ">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Clique para selecionar imagens
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                WEBP, PNG, JPG
              </p>
              {error ? <p className="text-xs">Selecione 4 imagens</p> : ""}
            </div>
            <Input
              className="appearance-none hidden w-full"
              type="file"
              accept="image/jpeg, image/png , image/webp"
              ref={inputImageRef}
              onChange={(e) => handleImage(e)}
            />
          </Label>
        </div>

        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="grid grid-cols-4 my-4 ">
            {cols.map((x) => {
              const columnItems = previewImages.filter(
                (imageItem) => imageItem.col === x.id
              );

              return (
                <Droppable key={x.id} id={x.id} className="w-full">
                  {columnItems.map((item, itemIndex) => (
                    <Draggable key={item.id} id={item.id}>
                      <Image
                        key={itemIndex} // Better key
                        src={item.image}
                        width={200}
                        height={200}
                        className="h-auto max-w-full rounded-lg"
                        alt="Grid image"
                      />
                    </Draggable>
                  ))}
                </Droppable>
              );
            })}
          </div>
        </DndContext>
      </div>

      <div className="flex items-center justify-between mt-3 ">
        <Button
          type="button"
          onClick={() => {
            handleGoBack();
          }}
        >
          <ArrowLeft /> Voltar
        </Button>
        <Button type="submit" onClick={handleNext}>
          Próximo <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default ImagesForm;
