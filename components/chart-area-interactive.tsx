"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Stock movements over time"

// Stock movement data - incoming vs consumed
const chartData = [
  { date: "2024-04-01", incoming: 45, consumed: 32 },
  { date: "2024-04-02", incoming: 12, consumed: 28 },
  { date: "2024-04-03", incoming: 0, consumed: 41 },
  { date: "2024-04-04", incoming: 78, consumed: 35 },
  { date: "2024-04-05", incoming: 23, consumed: 52 },
  { date: "2024-04-06", incoming: 0, consumed: 18 },
  { date: "2024-04-07", incoming: 0, consumed: 25 },
  { date: "2024-04-08", incoming: 56, consumed: 44 },
  { date: "2024-04-09", incoming: 0, consumed: 38 },
  { date: "2024-04-10", incoming: 34, consumed: 29 },
  { date: "2024-04-11", incoming: 0, consumed: 67 },
  { date: "2024-04-12", incoming: 89, consumed: 45 },
  { date: "2024-04-13", incoming: 0, consumed: 31 },
  { date: "2024-04-14", incoming: 0, consumed: 22 },
  { date: "2024-04-15", incoming: 67, consumed: 48 },
  { date: "2024-04-16", incoming: 23, consumed: 36 },
  { date: "2024-04-17", incoming: 0, consumed: 55 },
  { date: "2024-04-18", incoming: 45, consumed: 42 },
  { date: "2024-04-19", incoming: 0, consumed: 28 },
  { date: "2024-04-20", incoming: 0, consumed: 19 },
  { date: "2024-04-21", incoming: 0, consumed: 24 },
  { date: "2024-04-22", incoming: 112, consumed: 38 },
  { date: "2024-04-23", incoming: 0, consumed: 51 },
  { date: "2024-04-24", incoming: 34, consumed: 33 },
  { date: "2024-04-25", incoming: 0, consumed: 46 },
  { date: "2024-04-26", incoming: 0, consumed: 21 },
  { date: "2024-04-27", incoming: 0, consumed: 17 },
  { date: "2024-04-28", incoming: 0, consumed: 29 },
  { date: "2024-04-29", incoming: 78, consumed: 44 },
  { date: "2024-04-30", incoming: 0, consumed: 52 },
  { date: "2024-05-01", incoming: 56, consumed: 37 },
  { date: "2024-05-02", incoming: 0, consumed: 48 },
  { date: "2024-05-03", incoming: 0, consumed: 31 },
  { date: "2024-05-04", incoming: 0, consumed: 26 },
  { date: "2024-05-05", incoming: 0, consumed: 43 },
  { date: "2024-05-06", incoming: 89, consumed: 55 },
  { date: "2024-05-07", incoming: 0, consumed: 39 },
  { date: "2024-05-08", incoming: 45, consumed: 47 },
  { date: "2024-05-09", incoming: 0, consumed: 34 },
  { date: "2024-05-10", incoming: 0, consumed: 28 },
  { date: "2024-05-11", incoming: 0, consumed: 22 },
  { date: "2024-05-12", incoming: 0, consumed: 19 },
  { date: "2024-05-13", incoming: 67, consumed: 41 },
  { date: "2024-05-14", incoming: 0, consumed: 58 },
  { date: "2024-05-15", incoming: 34, consumed: 44 },
  { date: "2024-05-16", incoming: 0, consumed: 37 },
  { date: "2024-05-17", incoming: 0, consumed: 52 },
  { date: "2024-05-18", incoming: 0, consumed: 25 },
  { date: "2024-05-19", incoming: 0, consumed: 31 },
  { date: "2024-05-20", incoming: 98, consumed: 46 },
  { date: "2024-05-21", incoming: 0, consumed: 39 },
  { date: "2024-05-22", incoming: 23, consumed: 33 },
  { date: "2024-05-23", incoming: 0, consumed: 48 },
  { date: "2024-05-24", incoming: 0, consumed: 27 },
  { date: "2024-05-25", incoming: 0, consumed: 21 },
  { date: "2024-05-26", incoming: 0, consumed: 18 },
  { date: "2024-05-27", incoming: 56, consumed: 42 },
  { date: "2024-05-28", incoming: 0, consumed: 55 },
  { date: "2024-05-29", incoming: 78, consumed: 38 },
  { date: "2024-05-30", incoming: 0, consumed: 49 },
  { date: "2024-05-31", incoming: 0, consumed: 34 },
  { date: "2024-06-01", incoming: 0, consumed: 23 },
  { date: "2024-06-02", incoming: 0, consumed: 29 },
  { date: "2024-06-03", incoming: 112, consumed: 51 },
  { date: "2024-06-04", incoming: 0, consumed: 44 },
  { date: "2024-06-05", incoming: 45, consumed: 37 },
  { date: "2024-06-06", incoming: 0, consumed: 56 },
  { date: "2024-06-07", incoming: 0, consumed: 42 },
  { date: "2024-06-08", incoming: 0, consumed: 28 },
  { date: "2024-06-09", incoming: 0, consumed: 35 },
  { date: "2024-06-10", incoming: 67, consumed: 47 },
  { date: "2024-06-11", incoming: 0, consumed: 39 },
  { date: "2024-06-12", incoming: 34, consumed: 53 },
  { date: "2024-06-13", incoming: 0, consumed: 31 },
  { date: "2024-06-14", incoming: 0, consumed: 44 },
  { date: "2024-06-15", incoming: 0, consumed: 26 },
  { date: "2024-06-16", incoming: 0, consumed: 22 },
  { date: "2024-06-17", incoming: 89, consumed: 58 },
  { date: "2024-06-18", incoming: 0, consumed: 41 },
  { date: "2024-06-19", incoming: 56, consumed: 35 },
  { date: "2024-06-20", incoming: 0, consumed: 49 },
  { date: "2024-06-21", incoming: 0, consumed: 33 },
  { date: "2024-06-22", incoming: 0, consumed: 27 },
  { date: "2024-06-23", incoming: 0, consumed: 38 },
  { date: "2024-06-24", incoming: 78, consumed: 52 },
  { date: "2024-06-25", incoming: 0, consumed: 45 },
  { date: "2024-06-26", incoming: 45, consumed: 36 },
  { date: "2024-06-27", incoming: 0, consumed: 61 },
  { date: "2024-06-28", incoming: 0, consumed: 29 },
  { date: "2024-06-29", incoming: 0, consumed: 24 },
  { date: "2024-06-30", incoming: 0, consumed: 43 },
]

const chartConfig = {
  movements: {
    label: "Stock Movements",
  },
  incoming: {
    label: "Incoming",
    color: "oklch(0.6 0.15 145)",
  },
  consumed: {
    label: "Consumed",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Stock Movements</CardTitle>
          <CardDescription>
          <span className="hidden @[540px]/card:block">
            Incoming and consumed items over time
          </span>
            <span className="@[540px]/card:hidden">Stock activity</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-incoming)"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-incoming)"
                      stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillConsumed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-consumed)"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-consumed)"
                      stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
              />
              <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }}
                        indicator="dot"
                    />
                  }
              />
              <Area
                  dataKey="consumed"
                  type="natural"
                  fill="url(#fillConsumed)"
                  stroke="var(--color-consumed)"
              />
              <Area
                  dataKey="incoming"
                  type="natural"
                  fill="url(#fillIncoming)"
                  stroke="var(--color-incoming)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}
