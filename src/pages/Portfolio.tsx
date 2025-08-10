import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const holdings = [
  { symbol: 'BTCUSD', qty: 0.75, avg: 41200, last: 42350 },
  { symbol: 'ETHUSD', qty: 4.2, avg: 2450, last: 2580 },
  { symbol: 'EURUSD', qty: 15000, avg: 1.07, last: 1.0842 },
];

export default function PortfolioPage() {
  return (
    <>
      <Helmet>
        <title>TradingAnalytics – Portfolio</title>
        <meta name="description" content="Holdings, posições abertas e P/L (mock)." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/portfolio'} />
      </Helmet>

      <main className="container py-6 space-y-4 animate-enter">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Símbolo</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Avg</TableHead>
                  <TableHead className="text-right">Último</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((h) => (
                  <TableRow key={h.symbol}>
                    <TableCell className="font-medium">{h.symbol}</TableCell>
                    <TableCell className="text-right">{h.qty}</TableCell>
                    <TableCell className="text-right">{h.avg}</TableCell>
                    <TableCell className="text-right">{h.last}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
