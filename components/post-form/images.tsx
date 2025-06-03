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
  ChevronDown,
  CircleFadingArrowUpIcon,
  InfoIcon,
  MoreVerticalIcon,
  OctagonAlert,
  Plus,
  Star,
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
import CarouselWithThumbs from "./thumbs";
import Thumbs from "./thumbs";

export type previewImage = {
  image: string;
  file_name: string;
  id: string;
  index: number;
};

export interface CustomFile extends File {
  id: string;
}

function ImagesForm() {
  const formState = useFormState();
  const inputImageRef = useRef<HTMLInputElement>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const [imageFiles, setImageFiles] = useState<CustomFile[]>(
    formState.form.photoFiles ? formState.form.photoFiles : []
  );
  const [error, setError] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<previewImage[]>(
    formState.form.photoURLPREVIEW ? formState.form.photoURLPREVIEW : []
  );

  const sendPicturesToFormState = () => {
    formState.setFormData({ photoFiles: [...imageFiles] });
    formState.setFormData({ photoURLPREVIEW: [...previewImages] });

    formState.setFormStep();
  };

  const handleNext = () => {
    sendPicturesToFormState();
  };
  const handleGoBack = () => formState.setGoBackOneStep();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = files[0] as CustomFile;

      const url = URL.createObjectURL(image);

      const isDuplicate = imageFiles.find(
        (imageFile) => imageFile.name === image.name
      );

      if (isDuplicate) return;

      const customImageFileObject = {
        lastModified: image.lastModified,
        name: image.name,
        size: image.size,
        type: image.type,
        id: url,
      };

      const imagePreviewObject = {
        image: customImageFileObject.id,
        file_name: customImageFileObject.name,
        id: customImageFileObject.id,
        index: previewImages.length,
      };

      setImageFiles((oldValue) => [...oldValue, customImageFileObject]);
      setPreviewImages((oldValue) => [...oldValue, imagePreviewObject]);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  function handleDragEnd(event) {
    setIsDragging(false);

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setPreviewImages((currentImages) => {
      const activeIndex = currentImages.findIndex(
        (img) => img.id === active.id
      );
      const overIndex = currentImages.findIndex((img) => img.id === over.id);

      if (activeIndex === -1 || overIndex === -1) return currentImages;

      const newImages = [...currentImages];
      [newImages[activeIndex], newImages[overIndex]] = [
        newImages[overIndex],
        newImages[activeIndex],
      ];

      setActiveId(null);
      return newImages.map((img, index) => ({
        ...img,
        index: index,
      }));
    });
    setImageFiles((currentImages) => {
      const activeIndex = currentImages.findIndex(
        (img) => img.id === active.id
      );
      const overIndex = currentImages.findIndex((img) => img.id === over.id);

      if (activeIndex === -1 || overIndex === -1) return currentImages;

      const newImages = [...currentImages];
      [newImages[activeIndex], newImages[overIndex]] = [
        newImages[overIndex],
        newImages[activeIndex],
      ];

      setActiveId(null);
      return newImages.map((img, index) => ({
        ...img,
        index: index,
      }));
    });
  }

  const handleGrid = (index: number) => {
    if (index === 0 || index === 3)
      return "w-full  h-full    object-cover aspect-square col-span-2 row-span-2";
    else return "w-full h-full  object-cover aspect-square";
  };

  const setImageToFirst = (imagePreview: previewImage) => {
    const previewImagesFiltered = previewImages.filter(
      (image) => image.id !== imagePreview.id
    );

    const file = imageFiles.filter(
      (image) => image.name === imagePreview.file_name
    );
    const filesFiltered = imageFiles.filter(
      (image) => image.name !== imagePreview.file_name
    );

    const newFilesArr = [file[0], ...filesFiltered];

    const newPreviewArr = [imagePreview, ...previewImagesFiltered];

    setPreviewImages(newPreviewArr);
    setImageFiles(newFilesArr);
  };

  const deleteImage = (imagePreview: previewImage) => {
    const previewImagesFiltered = previewImages.filter(
      (image) => image.id !== imagePreview.id
    );

    const filesFiltered = imageFiles.filter(
      (image) => image.name !== imagePreview.file_name
    );

    setImageFiles(filesFiltered);
    setPreviewImages(previewImagesFiltered);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen ? (
        <Thumbs images={previewImages} handleCloseModal={handleCloseModal} />
      ) : (
        <>
          {" "}
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
              <div className="grid grid-cols-4 my-4 gap-5 ">
                {previewImages.map((image, index) => {
                  return (
                    <div className={handleGrid(index)} key={index}>
                      <Droppable id={image.id} key={image.id}>
                        <div className="w-full  flex items-center justify-center relative ">
                          <div
                            className={
                              isDragging && activeId === image.id
                                ? "hidden "
                                : "[&>*]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md divide-x divide-border/40 flex absolute top-0 right-0 m-4 "
                            }
                          >
                            <Button>
                              {index === 0 ? "Imagem principal" : index + 1}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon">
                                  <ChevronDown />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="min-w-52">
                                {index === 0 ? null : (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setImageToFirst(image);
                                    }}
                                  >
                                    Selecionar para imagem principal
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => {
                                    deleteImage(image);
                                  }}
                                >
                                  Deletar imagem
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="default"
                                  onClick={() => {
                                    setIsOpen(true);
                                  }}
                                >
                                  Ver imagens
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <Draggable id={image.id}>
                            <Image
                              src={image.image}
                              alt="image from form "
                              width={900}
                              height={900}
                              className={
                                index === 0
                                  ? "w-full rounded-md h-full object-cover aspect-square "
                                  : "w-full h-full rounded-md object-cover aspect-square"
                              }
                            />
                          </Draggable>
                        </div>
                      </Droppable>
                    </div>
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
        </>
      )}
    </div>
  );
}

export default ImagesForm;
