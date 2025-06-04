import { CustomFile, previewImage } from "@/components/post-form/images";
import { create } from "zustand";

export type newPostForm = {
  title?: string;
  textDescription?: string;
  log?: string;
  street?: string;
  city?: string;
  estate?: string;
  CEP?: string;
  price?: string;
  IPTU?: string;
  rooms?: string;
  garage?: string;
  bathrooms?: string;
  bedrooms?: string;
  area?: string;
  photoURLPREVIEW?: previewImage[];
  photoFiles?: CustomFile[];
};

export type formState = {
  form: newPostForm;
  formStep: number;
  setFormData: (formData: Partial<newPostForm>) => void;
  setFormStep: () => void;
  setChooseStepToGo: (step: number) => void;
  setGoBackOneStep: () => void;
};

export const useFormState = create<formState>()((set) => ({
  form: {
    title: "Condomínio Maison Rochelle",
    textDescription:
      "Nossa Senhora das Graças - Vieiralves. Vendo lindo apartamento localizado na área mais nobre de Manaus. Condomínio Maison Rochelle, contendo 80m² distribuídos em 3 quartos sendo 1 suíte, sala de jantar e estar com varanda, cozinha americana, completo de armários planejados de excelente qualidade e conservadíssimo, climatizado, com 01 vaga de garagem coberta, 100% reformado e totalmente documentado. Com portaria Digital e reconhecimento facial.",
    street: "TESTE",
    city: "TESTE",
    estate: "TESTE",
    CEP: "12345678",
    price: "100000",
    log: "TESTE",
    IPTU: "2000",
    rooms: "2",
    garage: "2",
    bathrooms: "1",
    bedrooms: "2",
    area: "200",
    photoURLPREVIEW: [],
    photoFiles: [],
  },
  formStep: 3,
  setFormStep: () => {
    const nextStep = useFormState.getState().formStep + 1;
    set({ formStep: nextStep });
  },
  setGoBackOneStep: () => {
    const previousStep = useFormState.getState().formStep - 1;
    set({ formStep: previousStep });
  },
  setChooseStepToGo: (step) => {
    set({ formStep: step });
  },
  setFormData: (formData) => {
    const data = useFormState.getState().form;
    set({ form: { ...data, ...formData } });
  },
}));
