import React, { useRef, useState } from "react";
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

import Image from "next/image";
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

function ImagesForm() {
  const query = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
  });

  const formState = useFormState();
  const [imageFiles, setImageFiles] = useState<File[]>(
    formState.form.photoFiles ? formState.form.photoFiles : []
  );
  const [error, setError] = useState<boolean>(false);

  const [previewImages, setPreviewImages] = useState<string[]>(
    formState.form.photoURLPREVIEW ? formState.form.photoURLPREVIEW : []
  );
  const [imagePanel, setOpenImagePanel] = useState<boolean>(false);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const [api, setApi] = React.useState<CarouselApi>();

  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = files[0];
      //store image files
      setImageFiles((oldValue) => [...oldValue, image]);

      //create preview
      const url = URL.createObjectURL(image);
      setPreviewImages((oldValue) => [...oldValue, url]);
    }
  };

  const deleteImageFromImageList = (imageUrl: string, index: number) => {
    setPreviewImages((oldValues) => {
      const filteredImages = oldValues.filter((i) => i !== imageUrl);
      return filteredImages;
    });

    deleteImageFromFileList(index);
  };

  const deleteImageFromFileList = (index: number) => {
    setImageFiles((oldValues) => {
      const filteredImages = oldValues.filter((i, index) => index !== index);
      return filteredImages;
    });
  };

  const handleImagePanel = () => {
    setOpenImagePanel((oldValue) => !oldValue);
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const uploadImages = () => {
    if (imageFiles.length < 4) {
      return;
    } else {
      formState.setFormData({ photoURLPREVIEW: [...previewImages] });
      formState.setFormData({ photoFiles: [...imageFiles] });

      formState.setFormStep();
    }
  };

  const changePrimaryPictureFromArray = (currentPic: string, index: number) => {
    const t = previewImages.filter((value) => value !== currentPic);
    const x = [currentPic, ...t];
    setPreviewImages(x);
  };

  const handleNext = () => {
    if (imageFiles.length < 4) {
      setError(true);
    }
    uploadImages();
  };
  const handleGoBack = () => formState.setGoBackOneStep();

  return (
    <div>
      <div className="w-full ">
        <div className="w-full  ">
          <div className="grid grid-cols-4  gap-2 space-x-2 ">
            <div className="relative  min-h-[280px] z w-full">
              <Label
                className={
                  error
                    ? "flex flex-col items-center justify-center h-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 "
                    : "flex flex-col items-center justify-center h-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
          </div>
        </div>
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
