import React, { useEffect, useRef } from "react";
import { useChartStore } from "@/state/chartStore";
import { getBars, subscribeBars, Bar } from "@/services/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UTCTimestamp } from "lightweight-charts";

const TF: Array<{ key: ReturnType<typeof useChartStore.getState>['timeframe']; label: string }> = [
  { key: "1H", label: "1H" },
  { key: "4H", label: "4H" },
  { key: "1D", label: "1D" },
  { key: "1W", label: "1W" },
];

export const PriceChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { symbol, timeframe, chartType, live, setTimeframe } = useChartStore();
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    async function setup() {
      const el = containerRef.current;
      if (!el) return;
      const { createChart } = await import("lightweight-charts");
      if (!mounted) return;

      // cleanup previous
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const chart = createChart(el, {
        layout: {
          textColor: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
          background: { color: 'transparent' },
        },
        grid: {
          vertLines: { color: 'rgba(37,49,64,0.3)' },
          horzLines: { color: 'rgba(37,49,64,0.3)' },
        },
        rightPriceScale: { borderColor: 'rgba(37,49,64,0.4)' },
        timeScale: { borderColor: 'rgba(37,49,64,0.4)' },
        crosshair: { mode: 1 },
        autoSize: true,
      });
      chartRef.current = chart;

      const isCandle = chartType === 'candlestick';
      const series = isCandle
        ? chart.addCandlestickSeries({
            upColor: 'hsl(var(--success))',
            downColor: 'hsl(var(--destructive))',
            borderDownColor: 'hsl(var(--destructive))',
            borderUpColor: 'hsl(var(--success))',
            wickDownColor: 'hsl(var(--destructive))',
            wickUpColor: 'hsl(var(--success))',
          })
        : chart.addAreaSeries({
            lineColor: 'hsl(var(--primary))',
            topColor: 'rgba(79,179,255,0.25)',
            bottomColor: 'transparent',
          });
      seriesRef.current = series;

      const data = await getBars(symbol, timeframe, 200);
      if (!mounted) return;
      if (isCandle) {
        series.setData(
          data.map((b: Bar) => ({
            time: (Date.parse(b.t) / 1000) as UTCTimestamp,
            open: b.o,
            high: b.h,
            low: b.l,
            close: b.c,
          })) as any
        );
      } else {
        series.setData(
          data.map((b: Bar) => ({ time: (Date.parse(b.t) / 1000) as UTCTimestamp, value: b.c })) as any
        );
      }
    }

    setup();
    return () => {
      mounted = false;
      if (chartRef.current) chartRef.current.remove();
      if (unsubRef.current) unsubRef.current();
    };
  }, [symbol, timeframe, chartType]);

  useEffect(() => {
    if (!live || !seriesRef.current) {
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
      return;
    }
    const isCandle = chartType === 'candlestick';
    unsubRef.current = subscribeBars(symbol, timeframe, (b) => {
      if (!seriesRef.current) return;
      const time = (Date.parse(b.t) / 1000) as UTCTimestamp;
      if (isCandle) {
        (seriesRef.current as any).update({ time, open: b.o, high: b.h, low: b.l, close: b.c });
      } else {
        (seriesRef.current as any).update({ time, value: b.c });
      }
    });

    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [live, symbol, timeframe, chartType]);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base sm:text-lg">Interactive Trading Chart – {symbol}</CardTitle>
        <div className="flex items-center gap-2">
          {TF.map((t) => (
            <Button
              key={t.key}
              size="sm"
              variant={timeframe === t.key ? "default" : "secondary"}
              onClick={() => setTimeframe(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="h-[360px] sm:h-[420px] w-full" />
      </CardContent>
    </Card>
  );
};
