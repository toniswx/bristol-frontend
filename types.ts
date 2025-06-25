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
   userProfilePicture:string
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
