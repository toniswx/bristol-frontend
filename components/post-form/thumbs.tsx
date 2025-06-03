"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Images, X } from "lucide-react";
import { previewImage } from "./images";
import Image from "next/image";
import { Button } from "../ui/button";

export default function CarouselWithThumbs({
  images,
  handleCloseModal,
}: {
  images: previewImage[];
  handleCloseModal: () => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);
      thumbsApi?.scrollTo(newIndex);
    });
  }, [api, thumbsApi]);

  const handleThumbClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="absolute top-0 right-0 bg-white  w-full h-full flex items-center  justify-center">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="my-2">
            {current + 1} de {count}
          </h2>
          <Button variant={"outline"} onClick={handleCloseModal}>
            <X />
          </Button>
        </div>

        <Carousel setApi={setApi} className="w-full max-w-2xl">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image.image}
                  alt="image from form "
                  width={1000}
                  height={1000}
                  className={
                    "w-full h-full rounded-md object-contain aspect-square"
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        {/* Thumbnail Carousel */}
        <Carousel
          setApi={setThumbsApi}
          className="mt-4 w-full "
          opts={{
            align: "start",
            dragFree: true,
          }}
        >
          <CarouselContent className="flex my-1">
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "basis-1/6 cursor-pointer",
                  current === index ? "opacity-100" : "opacity-50"
                )}
                onClick={() => handleThumbClick(index)}
              >
                <Image
                  src={image.image}
                  alt="image from form "
                  width={900}
                  height={900}
                  className={
                    "w-full h-full rounded-md object-cover aspect-square"
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
