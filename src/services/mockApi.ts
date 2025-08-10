import { addMinutes, subHours } from "date-fns";

export type Bar = { t: string; o: number; h: number; l: number; c: number; v: number };
export type Trade = { symbol: string; side: 'LONG' | 'SHORT'; qty: number; price: number; ts: string; pl: number };
export type Signal = { id: string; name: string; rule: string; symbol: string; tf: string; status: 'active' | 'paused' | 'error' };

export async function getMarketOverview() {
  // Static mock resembling the brief
  return {
    portfolio: { value: 125430, delta_abs: 2040, delta_pct: 1.65 },
    active_trades: 8,
    win_rate: { pct: 68.5, delta_week: 2.1 },
    tickers: [
      { symbol: 'BTC/USD', price: 42350, change: +2.3 },
      { symbol: 'ETH/USD', price: 2580, change: -1.2 },
      { symbol: 'EUR/USD', price: 1.0842, change: +0.8 },
    ],
    active_signals: [
      { id: 's1', symbol: 'BTC', side: 'BUY', entry: 42100 },
      { id: 's2', symbol: 'ETH', side: 'SELL', entry: 2580 },
    ],
  };
}

export async function getRecentTrades(): Promise<Trade[]> {
  const now = new Date();
  return [
    { symbol: 'BTC/USD', side: 'LONG', qty: 0.3, price: 42100, ts: addMinutes(now, -30).toISOString(), pl: 340 },
    { symbol: 'ETH/USD', side: 'SHORT', qty: 2, price: 2590, ts: addMinutes(now, -120).toISOString(), pl: -120 },
    { symbol: 'EUR/USD', side: 'LONG', qty: 10000, price: 1.08, ts: addMinutes(now, -240).toISOString(), pl: 85 },
  ];
}

export async function getAnalysisSummary(symbol: string) {
  return {
    items: [
      { type: 'tech', title: 'Technical Signal', text: `${symbol} mostrando divergência otimista no RSI. Possível breakout acima da resistência.` },
      { type: 'risk', title: 'Risk Alert', text: 'Alta volatilidade esperada na abertura do mercado dos EUA. Avalie reduzir posição.' },
    ],
  };
}

export async function getBars(symbol: string, timeframe: string, limit = 200): Promise<Bar[]> {
  // Random-walk mock
  const start = subHours(new Date(), 50);
  let price = 42000;
  const bars: Bar[] = [];
  for (let i = 0; i < limit; i++) {
    const t = addMinutes(start, i * 60).toISOString();
    const vol = 500 + Math.random() * 1500;
    const drift = (Math.random() - 0.5) * 100;
    const o = price;
    const c = price + drift;
    const h = Math.max(o, c) + Math.random() * 40;
    const l = Math.min(o, c) - Math.random() * 40;
    bars.push({ t, o, h, l, c, v: Math.round(vol) });
    price = c;
  }
  return bars;
}

// Simple mock "WS" that ticks last close periodically
export function subscribeBars(symbol: string, timeframe: string, onBar: (bar: Bar) => void) {
  let price = 42000 + Math.random() * 200;
  const id = setInterval(() => {
    const drift = (Math.random() - 0.5) * 40;
    price = Math.max(1000, price + drift);
    const now = new Date().toISOString();
    const o = price - drift;
    const c = price;
    const h = Math.max(o, c) + Math.random() * 10;
    const l = Math.min(o, c) - Math.random() * 10;
    onBar({ t: now, o, h, l, c, v: Math.round(500 + Math.random() * 500) });
  }, 2000);

  return () => clearInterval(id);
}
