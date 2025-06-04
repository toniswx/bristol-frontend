import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  GalleryHorizontalEnd,
  GalleryThumbnailsIcon,
  Grid,
  InfoIcon,
  LayoutList,
  MoreVerticalIcon,
  OctagonAlert,
  Plus,
  Star,
  Trash,
  Trash2Icon,
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
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ImageIcon } from "@radix-ui/react-icons";
import NoImageSelected from "./no-image";
import ImageList from "./image-list";
import { toast } from "sonner";
import { data } from "../custom/estate-filter";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MenuIcon } from "lucide-react";

export type previewImage = {
  image: string;
  file_name: string;
  id: string;
  index: number;
  size: string;
  type: string;
};

export interface CustomFile extends File {
  id: string;
}

function ImagesForm() {
  const formState = useFormState();
  const inputImageRef = useRef<HTMLInputElement>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [interfaceView, setInterfaceView] = useState("dnd-grid");
  const [isDisabled, setDesabled] = useState(false);
  const [isDeletingImages, setIsDeletingImages] = useState(false);
  const [currentImage, setCurrentImage] = useState<previewImage | null>(null);

  const [imagesBulkDeletId, setImagesBulkDeletId] = useState<string[]>([]);
  const [pureImageFiles, setPureImagefiles] = useState<File[]>([]);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

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

      const maxSize = 1.9;
      if (image.size > maxSize * 1024 * 1024) {
        toast.error(`O tamanho do arquivo excede o limite de ${maxSize}MB`);
        return;
      }

      const url = URL.createObjectURL(image);

      const isDuplicate = imageFiles.find(
        (imageFile) => imageFile.name === image.name
      );

      if (isDuplicate) {
        toast.info(`Selecione imagens diferentes`);
        return;
      }

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
        type: customImageFileObject.type,
        size: customImageFileObject.size,
      };

      setPureImagefiles((oldValue) => [...oldValue, image]);
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
    if (index === 0)
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
    setDialogOpen(false);
  };

  const hadleDeleteMultipleImages = (imageId: string) => {
    setImagesBulkDeletId((oldValue) => [...oldValue, imageId]);
  };

  const setDeleteMultipleImages = () => {
    if (previewImages.length && imageFiles.length < 0) return;

    setIsDeletingImages((oldValue) => !oldValue);
    setDesabled((oldValue) => !oldValue);
  };

  const handleCurrentView = (view: string) => {
    setInterfaceView(view);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDialogOpen = () => {
    setDialogOpen((oldValue: boolean) => !oldValue);
    document.body.style.pointerEvents = "auto";
  };

  const handleSetCurrentImage = (currentImage: previewImage) => {
    setCurrentImage(currentImage);
  };
  const handleCleanCurrentImage = () => {
    setCurrentImage(null);
    setDialogOpen(false);
  };

  useEffect(() => {
    document.body.style.pointerEvents = "auto";

    if (currentImage !== null) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [currentImage]);
  return (
    <div>
      <div className="w-full gap-y-4 py-2 ">
        <div className="flex items-center justify-between border rounded-md flex-row-reverse ">
          <Menubar className=" shadow-none border-none">
            <MenubarMenu>
              <MenubarTrigger className="">
                Arquivo
                <Label>
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    ref={inputImageRef}
                    onChange={handleImage}
                  />
                </Label>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => inputImageRef.current?.click()}>
                  Adicionar foto <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Editar</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Deletar fotos <MenubarShortcut>⌘⌫</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Deletar todas as fotos <MenubarShortcut>⇧⌘⌫</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Rotacionar <MenubarShortcut>⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Recortar <MenubarShortcut>⌘C</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Visualização</MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onClick={() => {
                    handleCurrentView("slide");
                  }}
                >
                  Slide{" "}
                  <MenubarShortcut>
                    {" "}
                    <GalleryHorizontalEnd className="h-4 w-4" />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarItem
                  onClick={() => {
                    handleCurrentView("list");
                  }}
                >
                  Lista{" "}
                  <MenubarShortcut>
                    {" "}
                    <LayoutList className="h-4 w-4" />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarItem
                  onClick={() => {
                    handleCurrentView("dnd-grid");
                  }}
                >
                  Grid{" "}
                  <MenubarShortcut>
                    {" "}
                    <Grid className="h-4 w-4" />
                  </MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <div className=" flex items-center justify-between p-1">
            <ToggleGroup type="single" size={"default"} defaultValue="'grid">
              <ToggleGroupItem
                value="grid"
                aria-label="Toggle grid"
                onClick={() => {
                  handleCurrentView("dnd-grid");
                }}
              >
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="slide"
                aria-label="Toggle slide"
                onClick={() => {
                  handleCurrentView("slide");
                }}
              >
                <GalleryHorizontalEnd className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="strikethrough"
                aria-label="Toggle strikethrough"
                onClick={() => {
                  handleCurrentView("list");
                }}
              >
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            {isDragging ? (
              <Button variant={"destructive"} size={"icon"}>
                <Trash />
              </Button>
            ) : null}
          </div>
        </div>

        {interfaceView === "dnd-grid" ? (
          imageFiles.length === 0 ? (
            <NoImageSelected />
          ) : (
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <div className="grid grid-cols-4 my-1 gap-5 ">
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
                          {isDragging ? null : (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="absolute right-0 top-0 m-4"
                              >
                                <Button
                                  size={"icon"}
                                  variant={"secondary"}
                                  className="p-3 w-5 h-5"
                                >
                                  <MenuIcon />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="text-xs">
                                {index === 0 ? null : (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setImageToFirst(image);
                                    }}
                                  >
                                    Nova foto de capa
                                    <DropdownMenuShortcut>
                                      <Star />
                                    </DropdownMenuShortcut>
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() => {
                                    handleSetCurrentImage(image);
                                  }}
                                >
                                  Ver imagem
                                  <DropdownMenuShortcut>
                                    <ImageIcon />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive">
                                  Deletar imagem
                                  <DropdownMenuShortcut>
                                    <Trash />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          <Draggable id={image.id} isDisabled={isDisabled}>
                            <Badge
                              className="absolute m-4 text-xs"
                              variant={"secondary"}
                            >
                              {index === 0 ? "Imagem principal" : index + 1}
                            </Badge>

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
          )
        ) : null}
      </div>

      {interfaceView === "slide" ? (
        <Thumbs images={previewImages} handleCloseModal={handleCloseModal} />
      ) : null}
      {interfaceView === "list" ? (
        previewImages.length === 0 ? (
          <NoImageSelected />
        ) : (
          <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
            <Table className="overflow-x-hidden">
              <TableHeader className="overflow-x-hidden">
                <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 ">
                  <TableHead className="w-[100px] ">Visualização</TableHead>
                  <TableHead className="w-[100px]  text-start">
                    Tamanho
                  </TableHead>
                  <TableHead className="w-[100px]  text-start">Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="right-0 text-right"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-hidden">
                {previewImages.map((image, index) => {
                  return (
                    <TableRow
                      key={index}
                      className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
                    >
                      <TableCell className="flex items-center justify-center">
                        <Image
                          src={image.image}
                          className="aspect-auto object-cover"
                          width={70}
                          height={10}
                          alt="image from image list form"
                        />
                      </TableCell>
                      <TableCell>
                        {formatFileSize(parseInt(image.size))}{" "}
                      </TableCell>
                      <TableCell className="font-medium  w-[100px] ">
                        {image.file_name}
                      </TableCell>
                      <TableCell>{image.type}</TableCell>
                      <TableCell className="right-0 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"secondary"}>
                              <MenuIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentImage(image);
                              }}
                            >
                              Ver imagem
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                deleteImage(image);
                              }}
                            >
                              Deletar imagem
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )
      ) : null}
      {interfaceView === "list" ? (
        previewImages.length === 0 ? (
          <NoImageSelected />
        ) : (
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
              <Table className="overflow-x-hidden">
                <TableHeader className="overflow-x-hidden">
                  <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 ">
                    <TableHead className="w-[100px] ">Visualização</TableHead>
                    <TableHead className="w-[100px]  text-start">
                      Tamanho
                    </TableHead>
                    <TableHead className="w-[100px]  text-start">
                      Nome
                    </TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="right-0 text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-hidden">
                  {previewImages.map((image, index) => {
                    return (
                      <Droppable key={index} id={image.id}>
                        <div className="bg-red-400">
                          <Draggable id={image.id}>
                            <TableRow
                              key={index}
                              className="odd:bg-muted/50 [&>*]:whitespace-nowrap bg-amber-400"
                            >
                              <TableCell className="flex items-center justify-center">
                                <Image
                                  src={image.image}
                                  className="aspect-auto object-cover"
                                  width={70}
                                  height={10}
                                  alt="image from image list form"
                                />
                              </TableCell>
                              <TableCell>
                                {formatFileSize(parseInt(image.size))}{" "}
                              </TableCell>
                              <TableCell className="font-medium  w-[100px] ">
                                {image.file_name}
                              </TableCell>
                              <TableCell>{image.type}</TableCell>
                              <TableCell className="right-0 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size={"icon"} variant={"secondary"}>
                                      <MenuIcon />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentImage(image);
                                      }}
                                    >
                                      Ver imagem
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => {
                                        deleteImage(image);
                                      }}
                                    >
                                      Deletar imagem
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          </Draggable>
                        </div>
                      </Droppable>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DndContext>
        )
      ) : null}

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
      {currentImage && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <Button
                size={"icon"}
                variant={"secondary"}
                onClick={handleCleanCurrentImage}
              >
                <ArrowLeft />
              </Button>
              <DialogTitle>{currentImage.file_name}</DialogTitle>
              <DialogDescription>{currentImage.type}</DialogDescription>
            </DialogHeader>
            <Image
              src={currentImage.image}
              className="aspect-auto object-cover"
              width={2000}
              height={2000}
              alt="image from image list form"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ImagesForm;
