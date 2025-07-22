import { z } from "zod";
// types/user.ts
export type User = {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  imoveis?: Imovel[];
  session?: Session | null;
  createdAt: Date;
  token: string;
  profilePictureUrl: string;
  bio: string;
  preferences?: "all" | "verified";
  metadata: AccountMetadata[];
  recoveryEmail: string;
  recoveryPhone: string;
};

export type AccountMetadata = {
  id: string;
  userId: string;

  // Autenticação
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;

  // Rastreamento
  registrationIp: string | null;
  registrationDevice: string | null;
  deviceHash: string | null;

  // Atividades
  lastLogin: Date | null;
  lastLoginIp: string | null;
  loginCount: number;
  failedLoginAttempts: number;

  // Controle de versão
  profileVersion: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Segurança
  accountLockedUntil: Date | null;
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
  imoveisTotalLenght: number;
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
