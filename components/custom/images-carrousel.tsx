import React, { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import Image from "next/image";

import { ImageIcon, ImageMinus, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useFormState } from "@/lib/stores/formStore";

function ImageCarousel() {
  const formState = useFormState();

  const images = formState.form.photoURLPREVIEW;

  const [imagePanel, setOpenImagePanel] = useState<boolean>(false);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const [api, setApi] = React.useState<CarouselApi>();

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

  return (
    <div className=" flex items-center justify-center h-full w-full ">
      <div
        className="  h-full  flex items-center justify-center  text-muted-foreground flex-col w-[200px] "
        onClick={handleImagePanel}
      >
        <h2 className="text-xs">Ver todas as imagens</h2>
        <ImageIcon />
      </div>

      <div>
        {imagePanel && (
          <div className="p-10 fixed inset-0 w-full h-screen flex flex-col overscroll-none z-40 bg-white">
            {/* Header */}
            <div className="w-full flex items-center justify-between p-4 sm:p-6">
              <p className="text-sm">
                Imagem {current} de {count}
              </p>
              <Button onClick={handleImagePanel} className="p-2">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Main Image Carousel */}
            <div className="flex-1 flex items-center justify-center w-full overflow-hidden p-4">
              <Carousel className="w-full h-full max-w-6xl" setApi={setApi}>
                <CarouselContent className="h-full">
                  {images &&
                    images.map((i, index) => (
                      <CarouselItem
                        key={index}
                        className="h-full flex items-center justify-center"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={i}
                            fill
                            alt={`Post image ${index + 1}`}
                            className="object-contain"
                            priority={index === current - 1}
                            sizes="(max-width: 768px) 100vw, 80vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Thumbnail Carousel */}
            <div className="w-full bg-gray-100 p-4 border-t">
              <Carousel
                opts={{
                  align: "center",
                  slidesToScroll: "auto",
                }}
                className="w-full max-w-4xl mx-auto"
              >
                <CarouselContent>
                  {images &&
                    images.map((i, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-1/4 sm:basis-1/6 lg:basis-1/8"
                      >
                        <div
                          className="relative aspect-square cursor-pointer"
                          onClick={() => api?.scrollTo(index)}
                        >
                          <Image
                            src={i}
                            fill
                            alt={`Thumbnail ${index + 1}`}
                            className={`object-cover rounded-md ${
                              current === index + 1
                                ? "ring-2 p-1 transition-all border border-gray-800"
                                : "opacity-50"
                            }`}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCarousel;
