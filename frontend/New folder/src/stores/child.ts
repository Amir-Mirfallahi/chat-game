import { Child } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChildState {
  selectedChild: Child | null;
  selectChild: (child: Child) => void;
}

const useChildStore = create<ChildState>()(
  persist(
    (set) => ({
      selectedChild: null,
      selectChild: (child: Child) => set(() => ({ selectedChild: child })),
    }),
    { name: "selected-child" }
  )
);

export default useChildStore;
