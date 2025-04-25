"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { api } from "~/trpc/react";
import { useTeam } from "~/context/TeamProvider";
import { notFound } from "next/navigation";
import Spinner from "~/components/ui/spinner";
import { format } from "date-fns";

const chartConfig = {
  created: {
    label: "Erstellt",
    color: "var(--color-red-600)",
  },
  completed: {
    label: "Abgeschlossen",
    color: "var(--color-green-600)",
  },
} satisfies ChartConfig;

export function TeamDashboardStatsChartComponent() {
  const team = useTeam();
  if (!team) return notFound();

  const { data: open, status: openStatus } = api.teamStats.findOpen.useQuery({
    id: team.team.id,
  });
  const { data: closed, status: closedStatus } =
    api.teamStats.findClosed.useQuery({ id: team.team.id });
  if (openStatus !== "success" || closedStatus !== "success") {
    return <Spinner />;
  }

  if (!open || !closed) {
    return notFound();
  }

  const mergedData = mergeStats(open, closed);
  return (
    <Card className="~container/card">
      <CardHeader className="relative">
        <CardTitle>Gesamte Prozesse</CardTitle>
        <CardDescription>
          <span className="~[540px]/card:block hidden">Letzten 30 Tage</span>
          <span className="~[540px]/card:hidden">Letzten 30 Tage</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className={"max-h-[500px] w-full"}>
          <AreaChart data={mergedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value as number);
                return date.toLocaleDateString("de-DE", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickLine={false} axisLine={false} domain={[0, "auto"]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value as number);
                    return date.toLocaleDateString("de-DE", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="created"
              type="monotone"
              fill="var(--color-red-600)"
              fillOpacity={0.4}
              stroke="var(--color-red-600)"
            />
            <Area
              dataKey="completed"
              type="monotone"
              fill="var(--color-green-600)"
              fillOpacity={0.4}
              stroke="var(--color-green-600)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type GroupedOpen = {
  createdAt: Date;
  _count: number;
};

type GroupedClosed = {
  closedAt: Date | null;
  _count: number;
};

function mergeStats(open: GroupedOpen[], closed: GroupedClosed[]) {
  const map = new Map<
    string,
    { date: string; created: number; completed: number }
  >();
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = format(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - i),
      "yyyy-MM-dd",
    );
    map.set(date, { date, created: 0, completed: 0 });
  }

  for (const o of open) {
    const date = format(new Date(o.createdAt), "yyyy-MM-dd");
    if (map.has(date)) {
      map.get(date)!.created += o._count;
    }
  }

  for (const c of closed) {
    const date = format(new Date(c.closedAt ?? now), "yyyy-MM-dd");
    if (map.has(date)) {
      map.get(date)!.completed += c._count;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}
