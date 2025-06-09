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
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
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
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CircleFadingArrowUpIcon,
  Edit,
  Edit3,
  GalleryHorizontalEnd,
  GalleryThumbnailsIcon,
  Grid,
  Heart,
  InfoIcon,
  LayoutList,
  List,
  ListIcon,
  MoreVerticalIcon,
  OctagonAlert,
  Plus,
  Star,
  Trash,
  Trash2Icon,
  Upload,
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
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
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
  MenubarLabel,
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
import { SortableContext } from "@dnd-kit/sortable";
import { SortableTableRow } from "./SortableRow";
import { canExecuteHistoryAction } from "../tiptap-ui/undo-redo-button/undo-redo-button";
import { DroppableCustom } from "../dnd/custom";

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
  const [currentImageFile, setCurrentImageFile] = useState<CustomFile | null>(
    null
  );
  const [imageIdsToDelete, setImagesIdToDelete] = useState<string[]>([]);

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
    if (previewImages.length < 3) {
      toast.info("Selecione pelo menos 4 imagens");
    } else {
      sendPicturesToFormState();
    }
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

    const currentFile = imageFiles.find(
      (image) => image.id === event.active.id
    );
    if (!currentFile) return;

    setCurrentImageFile(currentFile);
  };

  function handleDragEnd(event) {
    console.log(event);
    setIsDragging(false);

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const currentImage = previewImages.find((i) => i.id === active.id);

    if (over.id === "deleting" && currentImage) {
      deleteImage(currentImage);
      toast.success(`Imagen deletada com sucesso.`);
    }

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
    setCurrentImage(null);
    toast.success("Imagem deletada com sucesso.");
  };

  const handleCloseModal = () => {
    setDialogOpen(false);
  };

  const hadleDeleteMultipleImages = () => {
    const ids = [...imageIdsToDelete];

    const newPreviewArr: previewImage[] = [];

    const newFileArr: CustomFile[] = [];

    previewImages.map((preview) => {
      if (!ids.includes(preview.id)) {
        newPreviewArr.push(preview);
      }
    });

    imageFiles.map((image) => {
      if (!ids.includes(image.id)) {
        newFileArr.push(image);
      }
    });
    setPreviewImages(newPreviewArr);
    setImageFiles(newFileArr);
    setImagesIdToDelete([]);
    toast.success(`Imagens deletadas com sucesso.`);
    setIsDeletingImages((oldValue) => !oldValue);
    setDesabled((oldValue) => !oldValue);
  };

  const setDeleteMultipleImages = () => {
    if (previewImages.length && imageFiles.length < 0) return;

    setIsDeletingImages((oldValue) => !oldValue);
    setDesabled((oldValue) => !oldValue);
    handleAddAllImagesToDelete();
  };

  const setIsDelentingImages = () => {
    if (previewImages.length && imageFiles.length < 0) return;

    setIsDeletingImages((oldValue) => !oldValue);
    setDesabled((oldValue) => !oldValue);

    setImagesIdToDelete([]);
  };

  const handleCurrentView = (view: string) => {
    setIsDeletingImages(false);
    setDesabled(false);
    setImagesIdToDelete([]);
    setCurrentImage(null);
    setInterfaceView(view);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSetCurrentImage = (currentImage: previewImage) => {
    setCurrentImage(currentImage);
  };
  const handleCleanCurrentImage = () => {
    setCurrentImage(null);
    setDialogOpen(false);
  };
  const handleAddImageToDelete = (id: string) => {
    const found = imageIdsToDelete.find((imageId) => imageId === id);

    if (found) {
      const removeImageIdFromArray = imageIdsToDelete.filter(
        (imageId) => imageId !== id
      );
      if (removeImageIdFromArray) setImagesIdToDelete(removeImageIdFromArray);
    } else {
      setImagesIdToDelete((oldValue) => [...oldValue, id]);
    }
  };

  const handleAddAllImagesToDelete = () => {
    const ids = previewImages.map((image) => image.id);
    setImagesIdToDelete(ids);
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
      <Label className="">
        <Input
          className="hidden"
          type="file"
          accept="image/jpeg, image/png, image/webp"
          ref={inputImageRef}
          onChange={handleImage}
        />
      </Label>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="">
          <Droppable id="deleting">
            {" "}
            <div className="w-full gap-y-4 py-2 ">
              <div className="flex items-center justify-between border rounded-md  ">
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
                      <MenubarItem
                        onClick={() => inputImageRef.current?.click()}
                      >
                        Adicionar foto{" "}
                        <MenubarShortcut>
                          <Upload />
                        </MenubarShortcut>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>

                <div className=" flex items-center justify-between p-1">
                  <ToggleGroup
                    type="single"
                    size={"default"}
                    defaultValue="'grid"
                  >
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
                </div>
              </div>

              {interfaceView === "dnd-grid" ? (
                imageFiles.length === 0 ? (
                  <NoImageSelected />
                ) : (
                  <DndContext
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    collisionDetection={closestCenter}
                  >
                    <div className="grid grid-cols-5 my-1 gap-5 ">
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
                              {isDragging ? null : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    asChild
                                    className="absolute right-0 top-0 m-4 z-50"
                                  >
                                    <Button
                                      size={"icon"}
                                      variant={"secondary"}
                                      className="p-3 w-5 h-5 "
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
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => {
                                        deleteImage(image);
                                      }}
                                    >
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
                                      ? "w-full rounded-md h-full object-cover aspect-square transition-all"
                                      : "w-full h-full rounded-md object-cover aspect-square transition-all"
                                  }
                                />
                              </Draggable>
                            </Droppable>
                          </div>
                        );
                      })}
                      <div className="h-full w-full aspect-square flex items-center justify-center border border-dashed  bg-muted text-muted-foreground">
                        <Trash />
                        <Droppable id="deleting"></Droppable>
                      </div>
                    </div>
                    <DragOverlay
                      modifiers={[restrictToWindowEdges]}
                      adjustScale
                      style={{
                        transition:
                          "transform 50ms cubic-bezier(0.2, 0, 0.2, 1),    50ms linear",
                        border: "rounded",
                      }}
                      dropAnimation={{
                        duration: 200,
                        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                      }}
                    >
                      {activeId ? (
                        <Image
                          src={activeId}
                          alt="image from form"
                          width={900}
                          height={900}
                          className="w-full rounded-md h-full object-cover aspect-square transition-all"
                        />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )
              ) : null}
            </div>
            {interfaceView === "slide" ? (
              <Thumbs
                images={previewImages}
                handleCloseModal={handleCloseModal}
              />
            ) : null}
            {interfaceView === "list" ? (
              previewImages.length === 0 ? (
                <NoImageSelected />
              ) : (
                <DndContext
                  onDragEnd={handleDragEnd}
                  onDragStart={handleDragStart}
                >
                  <SortableContext
                    items={previewImages.map((img) => img.id)}
                    disabled={isDeletingImages}
                  >
                    <Table className="overflow-hidden">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            Visualização
                          </TableHead>
                          <TableHead className="w-[70px]">Tamanho</TableHead>
                          <TableHead className="w-[90px]">Tipo</TableHead>
                          <TableHead className="w-[90px]">Nome</TableHead>
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Menubar className=" shadow-none border-none">
                                <MenubarMenu>
                                  <MenubarTrigger className="">
                                    Editar
                                  </MenubarTrigger>

                                  <MenubarContent>
                                    <MenubarLabel className="text-xs text-red-400">
                                      Imagens
                                    </MenubarLabel>
                                    <MenubarSeparator />
                                    {isDeletingImages ? null : (
                                      <MenubarItem
                                        onClick={setDeleteMultipleImages}
                                      >
                                        Selecionar todas
                                        <MenubarShortcut>
                                          <List />
                                        </MenubarShortcut>
                                      </MenubarItem>
                                    )}
                                    <MenubarItem onClick={setIsDelentingImages}>
                                      {isDeletingImages ? (
                                        "Cancelar"
                                      ) : (
                                        <>
                                          {" "}
                                          Selecionar imagens
                                          <MenubarShortcut>
                                            <ImageIcon />
                                          </MenubarShortcut>
                                        </>
                                      )}
                                    </MenubarItem>
                                  </MenubarContent>
                                </MenubarMenu>
                              </Menubar>

                              {isDeletingImages ? (
                                <div>
                                  <Button
                                    variant={"destructive"}
                                    size={"sm"}
                                    onClick={hadleDeleteMultipleImages}
                                  >
                                    <Trash />
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewImages.map((image, index) => (
                          <SortableTableRow key={image.id} id={image.id}>
                            <TableCell className="relative">
                              <Image
                                src={image.image}
                                width={70}
                                height={30}
                                alt="Preview"
                                className="aspect-square object-cover"
                              />
                            </TableCell>
                            <TableCell>
                              {formatFileSize(parseInt(image.size))}
                            </TableCell>
                            <TableCell>{image.type}</TableCell>
                            <TableCell className="max-w-20  ">
                              {image.file_name.slice(0, 20)}...
                            </TableCell>
                            <TableCell className="text-right flex items-center justify-end ">
                              {isDeletingImages ? (
                                <div className="  w-fit text-right  flex items-center justify-end p-3">
                                  <Checkbox
                                    checked={imageIdsToDelete.includes(
                                      image.id
                                    )}
                                    className=""
                                    onClick={() => {
                                      handleAddImageToDelete(image.id);
                                    }}
                                  />
                                </div>
                              ) : null}
                            </TableCell>
                          </SortableTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </SortableContext>
                  <DragOverlay
                    modifiers={[restrictToWindowEdges]}
                    adjustScale
                    style={{
                      transition:
                        "transform 50ms cubic-bezier(0.2, 0, 0.2, 1),    50ms linear",
                      border: "rounded",
                    }}
                    dropAnimation={{
                      duration: 200,
                      easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                    }}
                  >
                    {activeId ? (
                      <table className="">
                        <tbody className="">
                          <SortableTableRow id={activeId}>
                            <TableCell className="relative">
                              <Image
                                src={activeId}
                                width={70}
                                height={30}
                                alt="Preview"
                                className="aspect-square object-cover"
                              />
                            </TableCell>

                            <TableCell>
                              {formatFileSize(currentImageFile?.size)}
                            </TableCell>
                            <TableCell>{currentImageFile?.type}</TableCell>
                            <TableCell className="max-w-20  ">
                              {currentImageFile?.name}
                            </TableCell>

                            <TableCell className="text-right"></TableCell>
                          </SortableTableRow>
                        </tbody>
                      </table>
                    ) : null}
                  </DragOverlay>
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
          </Droppable>
        </div>
      </DndContext>
    </div>
  );
}

export default ImagesForm;
