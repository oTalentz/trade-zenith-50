import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { getMarketOverview, getRecentTrades, getAnalysisSummary } from "@/services/mockApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Trophy, CircleHelp } from "lucide-react";
import { PriceChart } from "@/components/charts/PriceChart";

const currency = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
const pct = (n: number) => `${n.toFixed(1)}%`;

const KPI = ({ title, value, sub }: { title: string; value: string; sub?: string }) => (
  <Card className="hover-scale">
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-xl">{value}</CardTitle>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </CardHeader>
  </Card>
);

export default function Index() {
  const { data: overview } = useQuery({ queryKey: ['overview'], queryFn: getMarketOverview });
  const { data: trades } = useQuery({ queryKey: ['trades'], queryFn: getRecentTrades });
  const { data: analysis } = useQuery({ queryKey: ['analysis'], queryFn: () => getAnalysisSummary('BTCUSD') });

  return (
    <>
      <Helmet>
        <title>TradingAnalytics – Dashboard</title>
        <meta name="description" content="Dashboard de trading com KPIs, gráfico interativo e sinais." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/'} />
      </Helmet>

      <main className="container py-6 space-y-6 animate-enter">
        {/* GRID 12 */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card className="hover-scale">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Market Overview</CardTitle>
                <CardDescription>Principais pares</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {overview?.tickers?.map((t: any) => (
                  <div key={t.symbol} className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium">{t.symbol}</div>
                      <div className="text-xs text-muted-foreground">{currency(t.price)}</div>
                    </div>
                    <div className={`text-xs font-medium ${t.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {t.change >= 0 ? '+' : ''}{t.change.toFixed(1)}%
                    </div>
                  </div>
                ))}

                <Separator className="my-3" />
                <div className="text-sm font-semibold">Active Signals</div>
                <div className="space-y-2">
                  {overview?.active_signals?.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2">
                      <div>
                        <div className="text-xs text-muted-foreground">{s.symbol} Entry</div>
                        <div className="text-sm font-medium">{currency(s.entry)}</div>
                      </div>
                      <Badge variant="secondary" className={s.side === 'BUY' ? 'text-success' : 'text-destructive'}>
                        {s.side}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center column */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPI
                title="Total Portfolio"
                value={overview ? currency(overview.portfolio.value) : '--'}
                sub={overview ? `${overview.portfolio.delta_abs > 0 ? '+' : ''}${currency(overview.portfolio.delta_abs)} · ${pct(overview.portfolio.delta_pct)}` : ''}
              />
              <KPI
                title="Active Trades"
                value={overview ? String(overview.active_trades) : '--'}
                sub="Disponíveis para gerenciamento"
              />
              <KPI
                title="Win Rate"
                value={overview ? pct(overview.win_rate.pct) : '--'}
                sub={overview ? `${overview.win_rate.delta_week >= 0 ? '+' : ''}${overview.win_rate.delta_week.toFixed(1)}% esta semana` : ''}
              />
            </div>

            {/* Chart */}
            <PriceChart />

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover-scale">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {trades?.map((t) => (
                    <div key={t.ts} className="flex items-center justify-between rounded-md bg-secondary/60 px-4 py-3">
                      <div>
                        <div className="text-sm font-medium">{t.symbol}</div>
                        <div className="text-xs text-muted-foreground">{new Date(t.ts).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${t.pl >= 0 ? 'text-success' : 'text-destructive'}`}>{t.pl >= 0 ? '+' : ''}{t.pl}</div>
                        <div className="text-xs text-muted-foreground">{t.side}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Market Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis?.items?.map((it: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 rounded-md bg-secondary/60 px-4 py-3">
                      {it.type === 'tech' ? (
                        <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                      ) : (
                        <CircleHelp className="h-4 w-4 text-warning mt-0.5" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{it.title}</div>
                        <div className="text-xs text-muted-foreground">{it.text}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
