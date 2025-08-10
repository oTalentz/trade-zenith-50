import { Helmet } from "react-helmet-async";
import { useChartStore } from "@/state/chartStore";
import { PriceChart } from "@/components/charts/PriceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ChartsPage() {
  const { symbol, timeframe, chartType, setSymbol, setTimeframe, setChartType, live, toggleLive } = useChartStore();

  return (
    <>
      <Helmet>
        <title>TradingAnalytics – Charts</title>
        <meta name="description" content="Chart avançado com timeframes, tipos e overlays (mock)." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/charts'} />
      </Helmet>

      <main className="container py-6 space-y-4 animate-enter">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger aria-label="Símbolo">
                <SelectValue placeholder="Símbolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSD">BTCUSD</SelectItem>
                <SelectItem value="ETHUSD">ETHUSD</SelectItem>
                <SelectItem value="EURUSD">EURUSD</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <SelectTrigger aria-label="Timeframe">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1H">1H</SelectItem>
                <SelectItem value="4H">4H</SelectItem>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={(v) => setChartType(v as any)}>
              <SelectTrigger aria-label="Tipo">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candlestick">Candlestick</SelectItem>
                <SelectItem value="line">Line</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={toggleLive} variant={live ? 'default' : 'secondary'}>
              {live ? 'Go Live: ON' : 'Go Live'}
            </Button>
          </CardContent>
        </Card>

        <PriceChart />
      </main>
    </>
  );
}
