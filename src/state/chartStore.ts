import { create } from "zustand";

export type Timeframe = "1H" | "4H" | "1D" | "1W";
export type ChartType = "line" | "candlestick";

interface ChartState {
  symbol: string;
  timeframe: Timeframe;
  chartType: ChartType;
  live: boolean;
  setSymbol: (s: string) => void;
  setTimeframe: (t: Timeframe) => void;
  setChartType: (t: ChartType) => void;
  toggleLive: () => void;
}

export const useChartStore = create<ChartState>((set) => ({
  symbol: "BTCUSD",
  timeframe: "1H",
  chartType: "candlestick",
  live: false,
  setSymbol: (s) => set({ symbol: s }),
  setTimeframe: (t) => set({ timeframe: t }),
  setChartType: (t) => set({ chartType: t }),
  toggleLive: () => set((s) => ({ live: !s.live })),
}));
