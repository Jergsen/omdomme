'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTheme } from 'next-themes';

type Props = {
  data: { period: string; avg: number; count: number }[];
};

export function TrendChart({ data }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? 'hsl(var(--muted))' : 'hsl(var(--border))';

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Ingen data ennå.</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis
            yAxisId="left"
            stroke="hsl(var(--chart-1))"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--chart-2))"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="avg" stroke="hsl(var(--chart-1))" dot={false} name="PR" />
          <Line yAxisId="right" type="monotone" dataKey="count" stroke="hsl(var(--chart-2))" dot={false} name="Antall" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
