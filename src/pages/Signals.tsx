import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const signals = [
  { id: 'sig_001', name: 'EMA9>EMA21 + RSI<30', rule: '(EMA9>EMA21) AND (RSI14<30)', symbol: 'BTCUSD', tf: '1H', status: 'active' },
  { id: 'sig_002', name: 'VWAP Reversion', rule: 'PRICE < VWAP', symbol: 'ETHUSD', tf: '1H', status: 'paused' },
  { id: 'sig_003', name: 'BB Squeeze', rule: 'BB(20,2) squeeze breakout', symbol: 'EURUSD', tf: '4H', status: 'error' },
] as const;

export default function SignalsPage() {
  return (
    <>
      <Helmet>
        <title>TradingAnalytics – Signals</title>
        <meta name="description" content="Construa, gerencie e execute sinais (mock)." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/signals'} />
      </Helmet>

      <main className="container py-6 space-y-4 animate-enter">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Signals</h1>
          <Button>Novo Signal</Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lista</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50">
            {signals.map((s) => (
              <div key={s.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{s.name} · {s.symbol} · {s.tf}</div>
                  <div className="text-xs text-muted-foreground">{s.rule}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={
                    s.status === 'active' ? 'text-success' : s.status === 'error' ? 'text-destructive' : 'text-warning'
                  }>
                    {s.status}
                  </Badge>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="secondary" size="sm">Backtest</Button>
                  <Button variant="secondary" size="sm">Enable/Disable</Button>
                  <Button size="sm">Execute (paper)</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
