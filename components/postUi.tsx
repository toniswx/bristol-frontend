"use client";

import dynamic from "next/dynamic";

// Dynamically import the map components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

import React from "react";
import DOMPurify from "dompurify";
import { newPostForm, formState, useFormState } from "../lib/stores/formStore";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Bath,
  Bed,
  Camera,
  Car,
  Edit,
  ImageIcon,
  Pin,
  Shapes,
  ShowerHead,
  User,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { SizeIcon } from "@radix-ui/react-icons";
import { CardContent, CardHeader } from "./custom/card-user-datas";
import { CardFooter } from "./ui/card";
import { Card } from "@/components/ui/card";
import ProfileCardSkeleton from "./custom/profile-card-skeleton";
import ProfileCard from "./custom/profile-card";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "./AuthWrapper";

function PostUi({ postData }: { postData: newPostForm }) {
  const formState = useFormState();

  const { data } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
  });

  const pricePerSqrMeter = postData.price / postData.area;

  console.log(formState.form);

  return (
    <div className=" gap-y-5 space-y-10 ">
      <div className="flex items-start justify-between my-6">
        <div className="">
          <h2 className="text-5xl line-clamp-2">{postData.title}</h2>
          <p className="text-muted-foreground text-sm">
            {postData.estate}, {postData.city} - {postData.street}
          </p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <p className="text-5xl ">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(parseInt(postData.price!))}
          </p>
          <p className="text-muted-foreground text-sm">
            {" "}
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(parseInt(pricePerSqrMeter!))}
            /m²
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 grid-rows-2  gap-5 ">
        <Image
          src={postData.photoURLPREVIEW[0].image}
          width={900}
          height={900}
          alt="post image"
          className="w-full col-span-2 row-span-2 rounded-md"
        />
        <div className="relative">
          <div className="absolute z-10 bg-black/80 w-full h-full flex items-center justify-center flex-col cursor-pointer ">
            <Camera className="text-white text-lg flex items-center justify-center " />
            <p className="text-white text-lg font-semibold flex items-center justify-center ">
              {" "}
              Ver todas
            </p>
            <p className=" text-sm text-neutral-400 flex items-center justify-center font-extralight">
              {postData.photoURLPREVIEW?.length - 2} imagens
            </p>
          </div>
          <Image
            src={postData.photoURLPREVIEW[1].image}
            width={900}
            height={900}
            alt="post image"
            className="w-full rounded-md"
          />
        </div>
      </div>
      <div className=" space-y-2 w-3/5">
        <h2 className="text-2xl ">Descrição</h2>
        <div className="text-muted-foreground ">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
            excepturi totam possimus ab ea dolore molestias tempore tempora
            veniam aspernatur iure odio error qui deleniti quidem, numquam
            exercitationem et perferendis! Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Tempore quaerat cum labore magni?
            Reprehenderit alias incidunt laboriosam natus quo. Magni debitis
            saepe voluptas expedita et corporis accusantium deleniti commodi
            doloribus!
          </p>
        </div>
      </div>
      <div className=" space-y-2 w-3/5">
        <h2 className="text-2xl ">Detalhes</h2>
        <div className="grid grid-cols-2   gap-4 w-2/3">
          <div className="w-full  flex items-center justify-between  p-2 ">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
              <ShowerHead className="relative bottom-[3px]" />
              <p>Banheiros</p>
            </div>
            <div>
              <p>{postData.bathrooms}</p>
            </div>
          </div>
          <div className="w-full  flex items-center justify-between  p-2 ">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
              <Bed className="relative bottom-[3px]" />
              <p>Quartos</p>
            </div>
            <div>
              <p className="text-sm ">{postData.bedrooms}</p>
            </div>
          </div>
          <div className="w-full  flex items-center justify-between  p-2 ">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
              <Car className="relative bottom-[3px]" />
              <p>Vaga de garagem</p>
            </div>
            <div>
              <p className="text-sm ">{postData.garage}</p>
            </div>
          </div>
          <div className="w-full  flex items-center justify-between  p-2 ">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
              <Car className="relative bottom-[3px]" />
              <p>Vaga de garagem</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostUi;

/* {formState.form.geoCords !== undefined ? (
          <div className="">
            <MapContainer
              center={[
                formState.form.geoCords.lat.toString(),
                formState.form.geoCords.long.toString(),
              ]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: "99%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle
                center={[
                  formState.form.geoCords.lat,
                  formState.form.geoCords.long,
                ]}
                pathOptions={{ fillColor: "blue" }}
                radius={470}
                stroke={false}
              />
            </MapContainer>
          </div>
        ) : (
          <div
            className="map-placeholder"
            style={{
              height: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f0f0",
              color: "#666",
            }}
          >
            <p>Nenhuma visualização disponível.</p>
          </div>
        )} */
