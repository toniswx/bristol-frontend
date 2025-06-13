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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "@/lib/stores/formStore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGoBackOneFormStep } from "@/hooks/use-handle-go-back";

import { URLSearchParams } from "url";
import { json } from "stream/consumers";
import { geoAPI } from "@/types";

const formSchema = z.object({
  log: z.string().min(5, {
    message: "O logradouro precisa ter no mínimo 5 caracteres",
  }),
  street: z.string().min(5, {
    message: "A rua precisa ter no mínimo 5 caracteres",
  }),
  city: z.string().min(3, {
    message: "A cidade precisa ter no mínimo 3 caracteres",
  }),
  estate: z.string().min(2, {
    // Changed from 'state' to 'estate' to match your model
    message: "O estado precisa ter no mínimo 2 caracteres",
  }),
  CEP: z.string().length(8, {
    // Assuming format "XXXXX-XXX"
    message: "CEP deve ter 8 dígitos no formato XXXXX-XXX",
  }),
});

function LocationForm() {
  const [cepLoad, setCepLoad] = useState<boolean>(false);

  const formState = useFormState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      log: formState.form.log || "",
      street: formState.form.street || "",
      city: formState.form.city || "",
      estate: formState.form.estate || "",
      CEP: formState.form.CEP || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    formState.setFormData(values);
    formState.setFormStep();
  }
  const fetchCoordinates = async (
    address: string
  ): Promise<geoAPI[] | undefined> => {
    try {
      const encodedQuery = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`
      );

      const data: geoAPI[] = await response.json();
      if (data.length > 0) {
        return data;
      }
    } catch (error) {
      if (error) return undefined;
    }
  };

  const cepApi = async (cep: string) => {
    try {
      const adress = await fetch(`http://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
      });

      const data = await adress.json();

      if (!data) return;

      return data;
    } catch (err) {
      throw err;
    }
  };

  const getUserAdress = async (cep: string) => {
    /// nomatin api does not work properly with
    /// viacep api address data
    /// changing the last charachter to a 0 makes
    /// viacep api get a more general adress name
    /// thus make the nomatin api finding a street name
    /// more easy

    setCepLoad(true);
    formState.setFormData({
      geoCords: undefined,
    });
    //changes the last character to a 0
    const len = cep.length;
    const n = cep.split("");
    n[len - 1] = "0";
    let u = "";
    n.map((i) => (u = u + i));

    const data = await cepApi(cep);
    const mapData = await cepApi(u);

    const coordanates = await fetchCoordinates(
      `${mapData.localidade}, ${mapData.bairro}, ${mapData.logradouro}`
    );
    if (coordanates === undefined) return;
    formState.setFormData({
      geoCords: {
        lat: coordanates[0].lat,
        long: coordanates[0].lon,
      },
    });

    if (data.erro === "true") {
      form.setError("CEP", { message: "CEP não encontrado ou inválido." });
      form.setValue("city", "");
      form.setValue("street", "");
      form.setValue("estate", "");
      form.setValue("log", "");
      setCepLoad(false);
    } else {
      form.clearErrors("CEP");
      form.setValue("city", data.localidade);
      form.setValue("street", data.bairro);
      form.setValue("estate", data.estado);
      form.setValue("log", data.logradouro);

      setCepLoad(false);
    }
  };

  const x = form.watch("CEP");

  const cepRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      const formattedValue = formatarCep(ref.current.value);
      form.setValue("CEP", formattedValue);
    }
  };

  const formatarCep = (value: string) => {
    return value.replace(/\D/g, "");
  };

  useEffect(() => {
    if (x.length === 8) {
      getUserAdress(x);
    }
    handleInputChange(cepRef);
  }, [x]);

  const handleGoBack = () => formState.setGoBackOneStep();
  return (
    <div className="my-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=" space-y-5 ">
            {formState.form.geoCords !== undefined ? (
              <div
                className=""
                style={{
                  height: "250px",
                }}
              >
                <MapContainer
                  center={[
                    formState.form.geoCords.lat.toString(),
                    formState.form.geoCords.long.toString(),
                  ]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "250px" }}
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
                    radius={270}
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
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="CEP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="01310100 (Apenas números)"
                        {...field}
                        ref={cepRef}
                        maxLength={8}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value)) handleInputChange(cepRef);
                        }}
                        disabled={cepLoad}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="log"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Condomínio Jardins, Bloco A"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua/Avenida</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Paulista" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => {
                handleGoBack();
              }}
            >
              <ArrowLeft /> Voltar{" "}
            </Button>{" "}
            <Button type="submit">
              Próximo <ArrowRight />{" "}
            </Button>{" "}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default LocationForm;

function MapPlaceholder() {
  return (
    <p>
      Nenhuma visualização disponível.
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}
