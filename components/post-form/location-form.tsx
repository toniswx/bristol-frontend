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
  coordenates: z.any(),
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
      coordenates: formState.form.coordenates || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    formState.setFormData(values);
    formState.setFormStep();
  }
  const fetchCoordinates = async (address: string) => {
    try {
      const encodedQuery = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`
      );

      const data = await response.json();
      if (data.length > 0) {
        return data;
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  };

  const cepApi = (cep: string) => {};

  const getUserAdress = async (cep: string) => {
    setCepLoad(true);
    form.setValue("coordenates", undefined);

    const len = cep.length;

    const n = cep.split("");
    n[len - 1] = "0";
    let u = "";
    n.map((i) => (u = u + i));

    try {
      const adress = await fetch(`http://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
      });

      const data = await adress.json();

      if (!data) return;

      const coordanates = await fetchCoordinates(
        `${data.localidade}, ${data.bairro}, ${data.logradouro}`
      );

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
        if (coordanates !== undefined)
          form.setValue("coordenates", coordanates[0]);
        setCepLoad(false);
      }
    } catch (err) {
      console.error(err);
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
            {form.getValues().coordenates !== undefined ? (
              <MapContainer
                center={[
                  form.getValues().coordenates.lat.toString(),
                  form.getValues().coordenates.lon.toString(),
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
                    form.getValues().coordenates.lat.toString(),
                    form.getValues().coordenates.lon.toString(),
                  ]}
                  pathOptions={{ fillColor: "blue" }}
                  radius={500}
                  stroke={false}
                />
              </MapContainer>
            ) : (
              ""
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
