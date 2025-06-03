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
  GalleryThumbnailsIcon,
  InfoIcon,
  MoreVerticalIcon,
  OctagonAlert,
  Plus,
  Star,
  Trash,
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
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

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
  const [isDisabled, setDesabled] = useState(false);
  const [isDeletingImages, setIsDeletingImages] = useState(false);
  const [imagesBulkDeletId, setImagesBulkDeletId] = useState<string[]>([]);

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
      return "w-full  h-full    object-cover aspect-square col-span-2 row-span-2 relative";
    else return "w-full h-full  object-cover aspect-square relative";
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
  const hadleDeleteMultipleImages = (imageId: string) => {
    setImagesBulkDeletId((oldValue) => [...oldValue, imageId]);
  };

  const setDeleteMultipleImages = () => {
    if (previewImages.length && imageFiles.length < 0) return;

    setIsDeletingImages((oldValue) => !oldValue);
    setDesabled((oldValue) => !oldValue);
  };
  return (
    <div>
      {isOpen ? (
        <Thumbs images={previewImages} handleCloseModal={handleCloseModal} />
      ) : (
        <>
          {" "}
          <div className="w-full ">
            <div className="grid grid-cols-3   gap-x-2 ">
              <Label>
                <Button
                  onClick={() => inputImageRef.current?.click()}
                  variant={"secondary"}
                  className="bg-blue-100 w-full  border-blue-300 border hover:bg-blue-50 cursor-pointer"
                >
                  <Plus />
                  Adicionar imagem
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    ref={inputImageRef}
                    onChange={handleImage}
                  />
                </Button>
              </Label>

              <Button
                variant={"destructive"}
                onClick={setDeleteMultipleImages}
                className="bg-red-100 border-red-300 border hover:bg-red-50  text-black cursor-pointer"
              >
                {" "}
                <Trash />
                Deletar imagens
              </Button>
              <Button
                variant={"outline"}
                className="bg-neutral-100  border-neutral-300 border hover:bg-neutral-50 cursor-pointer"
              >
                {" "}
                <GalleryThumbnailsIcon /> Ver todas as imagens
              </Button>
            </div>

            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <div className="grid grid-cols-4 my-4 gap-5 ">
                {previewImages.map((image, index) => {
                  return (
                    <div
                      className={cn(
                        imagesBulkDeletId.includes(image.id)
                          ? "border border-red-600"
                          : "",
                        handleGrid(index)
                      )}
                      key={index}
                    >
                      <Droppable id={image.id} key={image.id}>
                        <div className="w-full  flex items-center justify-center relative ">
                          {isDeletingImages ? (
                            <div
                              className={
                                "[&>*]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md divide-x divide-border/40 flex absolute top-0 right-0 m-4 "
                              }
                            >
                              <div className="">
                                <Checkbox
                                  className="w-9 h-9 bg-white "
                                  onClick={() => {
                                    hadleDeleteMultipleImages(image.id);
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
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
                          )}
                          <Draggable id={image.id} isDisabled={isDisabled}>
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
