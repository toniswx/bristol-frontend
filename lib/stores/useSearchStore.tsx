import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SearchHistory = {
  history: {
    city: string;
    estate: string;
  }[];
  add: (data: { city: string; estate: string }) => void;
  remove: (city: string) => void;
};

export const useSearchStore = create<SearchHistory>()(
  persist<SearchHistory>(
    (set, get) => ({
      history: [],
      remove: (data) => {
        const x = get().history;

        const newData = x.filter((i) => i.city !== data);
        set({ history: newData });
      },
      add: (data) => {
        const currentHistory = get().history;
        if (currentHistory.find((item) => item.city === data.city)) return;
        set({ history: [...currentHistory, data] });
      },
    }),
    {
      name: "location-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
