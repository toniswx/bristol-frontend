import { userDetail } from "./types";
import { z } from "zod";
// types/user.ts
export type User = {
  id: string;
  email: string;
  password?: string;
  username: string;
  imoveis?: Imovel[];
  session?: Session | null;
  createdAt: Date;
  userDetail?: userDetail;
  imoveisTotalLenght: number;
  token: string;
};
export type PaginationInfo = {
  currentPage: number;
  itemsPerPage: number;
  firstItemOnPage: number;
  lastItemOnPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage?: boolean; // Optional, if you want to track previous page
};

export type UserWithoutProperties = {
  id: string;
  email: string;
  password?: string;
  username: string;
  session?: Session | null;
  createdAt: Date;
  userDetail?: userDetail;
  imoveisTotalLenght: number;
};

export type userDetail = {
  city: string;
  state: string;
  street: string;
};
export type Session = {
  id: string;
  userId: string;
  user?: User;
};

export type Imovel = {
  id: string;
  title: string;
  postedAt: Date | string;
  lastUpdate: Date | string;
  textDescription: string;
  estate: string;
  city: string;
  CEP: string;
  price: number;
  IPTU: string;
  rooms: number;
  bathrooms: number;
  garage: number;
  hasParking: boolean;
  bedrooms: number;
  area: number;
  userId: string;
  user?: User;
};

export type CreateImovel = Omit<
  Imovel,
  "id" | "postedAt" | "lastUpdate" | "user"
>;

export type UpdateImovel = Partial<CreateImovel> & { id: string };

export interface geoAPI {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: string;
  boundingbox: [string, string, string, string];
  lat: number;
  lon: number;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address: {
    city: string;
    state_district: string;
    state: string;
    "ISO3166-2-lvl4": string;
    postcode: string;
    country: string;
    country_code: string;
  };
  extratags: {
    capital?: string;
    website?: string;
    wikidata?: string;
    wikipedia?: string;
    population?: string;
    [key: string]: string | undefined; // For any additional optional properties
  };
}

export type Imovel_1 = {
  // Identificação básica
  id: string;
  title: string;
  description: string;
  type: "casa" | "apartamento" | "terreno" | "comercial" | "fazenda" | "outro";
  status: "venda" | "aluguel" | "venda/aluguel";

  // Datas
  postedAt: Date | string;
  lastUpdate: Date | string;

  // Localização
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    CEP: string;
    latitude?: number;
    longitude?: number;
  };

  // Preços e custos
  price: number;
  condominiumFee?: number;
  IPTU?: number;
  isNegotiable: boolean;

  // Características físicas
  area: {
    total: number;
    built?: number;
    useful?: number;
  };
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  garageSpaces: number;
  floors?: number;
  age?: number; // em anos
  constructionStage?: "pronto" | "na_planta" | "em_construcao";

  // Comodidades
  amenities: {
    parking: boolean;
    furnished: boolean;
    pool: boolean;
    gym: boolean;
    security: boolean;
    elevator: boolean;
    accessible: boolean;
    balcony: boolean;
    garden: boolean;
    barbecueArea: boolean;
    // Adicione outras comodidades conforme necessário
  };

  // Infraestrutura
  infrastructure: {
    water: "publica" | "poco" | "outro";
    sewage: "publica" | "fossa" | "outro";
    energy: "publica" | "gerador" | "solar" | "outro";
    garbage: "publica" | "privada";
    internet?: "fibra" | "radio" | "outro";
  };

  // Documentação
  documentation: {
    registry: "regular" | "irregular" | "em_regularizacao";
    hasDebts: boolean;
    pendingIssues?: string;
  };

  // Visual
  images: string[]; // URLs das imagens
  videos?: string[]; // URLs de vídeos
  virtualTour?: string; // URL do tour virtual
  floorPlan?: string; // URL do planta baixa

  // Contato e proprietário
  userId: string;
  user?: User;
  contact: {
    phone: string;
    email: string;
    preferredContactMethod: "phone" | "email" | "whatsapp";
  };

  // Metadados
  views: number;
  favorites: number;
  isFeatured: boolean;
  isActive: boolean;
};
