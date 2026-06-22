import { create } from "zustand";

export type ViewMode = "minimal" | "maximized";

type ViewState = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  toggle: () => void;
  isComposeOpen: boolean;
  setComposeOpen: (isOpen: boolean) => void;
};

export const useViewStore = create<ViewState>((set) => ({
  mode: "minimal",
  setMode: (mode) => set({ mode }),
  toggle: () =>
    set((state) => ({
      mode: state.mode === "minimal" ? "maximized" : "minimal",
    })),
  isComposeOpen: false,
  setComposeOpen: (isComposeOpen) => set({ isComposeOpen }),
}));
