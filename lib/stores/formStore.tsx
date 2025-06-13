import { CustomFile, previewImage } from "@/components/post-form/images";
import { create } from "zustand";

export type newPostForm = {
  geoCords:
    | {
        lat: number;
        long: number;
      }
    | undefined;
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
    geoCords: {
      lat: -9.566031,
      long: -35.742807,
    },
    title: "Condomínio Maison Rochelle",
    textDescription:
      '<h1 ">Nossa Senhora das Graças - Vieiralves. </h1><p><em>Vendo lindo apartamento localizado na área mais nobre de Manaus. </em></p><h3>Condomínio Maison Rochelle, </h3><ul><li><p>contendo 80m² distribuídos em 3 quartos sendo 1 suíte,</p></li><li><p> sala de jantar e estar com varanda, cozinha americana, </p></li><li><p>completo de armários planejados de excelente qualidade e</p></li><li><p> conservadíssimo, </p></li><li><p>climatizado, com 01 vaga de garagem coberta, 100% reformado e totalmente documentado. </p></li><li><p>Com portaria Digital e reconhecimento facial.</p></li></ul><p></p>',
    street: "São Miguel",
    city: "Barra de São Miguel",
    estate: "AL",
    CEP: "57083042",
    price: "1500000",
    log: "TESTE",
    IPTU: "2000",
    rooms: "2",
    garage: "2",
    bathrooms: "1",
    bedrooms: "2",
    area: "200",
    photoURLPREVIEW: [
      {
        image:
          "https://fastly.picsum.photos/id/419/1200/900.jpg?hmac=hVOSdKAKqnpDysHJb4JEI-YyXQQHNBdKsRewHO0od2U", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/419/1200/900.jpg?hmac=hVOSdKAKqnpDysHJb4JEI-YyXQQHNBdKsRewHO0od2U",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image: "https://picsum.photos/1200/900", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://picsum.photos/1200/900",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image:
          "https://fastly.picsum.photos/id/419/1200/900.jpg?hmac=hVOSdKAKqnpDysHJb4JEI-YyXQQHNBdKsRewHO0od2U", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/419/1200/900.jpg?hmac=hVOSdKAKqnpDysHJb4JEI-YyXQQHNBdKsRewHO0od2U",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image:
          "https://fastly.picsum.photos/id/146/1200/1200.jpg?hmac=HLTEC9GSnW8gVWKtKhiM_LnCj3XE4ZdwcW5Q4DZghgg", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/146/1200/1200.jpg?hmac=HLTEC9GSnW8gVWKtKhiM_LnCj3XE4ZdwcW5Q4DZghgg",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image:
          "https://fastly.picsum.photos/id/146/1200/1200.jpg?hmac=HLTEC9GSnW8gVWKtKhiM_LnCj3XE4ZdwcW5Q4DZghgg", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/146/1200/1200.jpg?hmac=HLTEC9GSnW8gVWKtKhiM_LnCj3XE4ZdwcW5Q4DZghgg",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image:
          "https://fastly.picsum.photos/id/488/1200/900.jpg?hmac=EyaebGuGpixWujBHVAtivhoIBgFWi0H5XLLHPyQen20", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/488/1200/900.jpg?hmac=EyaebGuGpixWujBHVAtivhoIBgFWi0H5XLLHPyQen20",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image:
          "https://fastly.picsum.photos/id/1044/500/300.jpg?hmac=-wK_QkLykaVPTpLucZPq3X9n6RNRBODbAmhaAFpkFmg", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/1044/500/300.jpg?hmac=-wK_QkLykaVPTpLucZPq3X9n6RNRBODbAmhaAFpkFmg",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image:
          "https://fastly.picsum.photos/id/45/500/300.jpg?hmac=4Ee7BZI2J5ysNej6CdyZBr0mnv0Tb-6VoYahGJVeKC8", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://fastly.picsum.photos/id/45/500/300.jpg?hmac=4Ee7BZI2J5ysNej6CdyZBr0mnv0Tb-6VoYahGJVeKC8",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image: "https://picsum.photos/500/300", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://picsum.photos/500/300",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
      {
        image: "https://picsum.photos/1200/900", // Imagem aleatória (500x300px)
        file_name: "placeholder.jpg",
        id: "https://picsum.photos/1200/900",
        index: 0,
        size: "300KB",
        type: "image/jpeg",
      },
    ],
    photoFiles: [],
  },
  formStep: 4,
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
