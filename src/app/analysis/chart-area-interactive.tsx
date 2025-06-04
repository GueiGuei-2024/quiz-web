"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ExamData } from "../types";
export const description = "An interactive area chart";

const chartConfig = {
  corrected: {
    label: "正確題數",
    color: "var(--primary)",
  },
  questions: {
    label: "作答題數",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type SummaryItem = {
  localDate: string;
  examNumber: number;
  questions: number;
  corrected: number;
  correctedRate: number;
};

export function ChartAreaInteractive({ data }: { data: ExamData[] }) {
  const summaryMap: Record<string, Omit<SummaryItem, "correctedRate">> = {};

  for (const exam of data) {
    const { localDate, total_number, correct } = exam;

    if (!summaryMap[localDate]) {
      summaryMap[localDate] = {
        localDate,
        examNumber: 0,
        questions: 0,
        corrected: 0,
      };
    }

    summaryMap[localDate].examNumber += 1;
    summaryMap[localDate].questions += total_number;
    summaryMap[localDate].corrected += correct;
  }

  // 步驟 2：加入 correctedRate，轉為 SummaryItem 陣列
  const summaryByDate: SummaryItem[] = Object.values(summaryMap).map((item) => {
    const correctedRate =
      item.questions > 0
        ? Math.round((item.corrected * 10000) / item.questions) / 100
        : 0;

    return {
      ...item,
      correctedRate,
    };
  });
  console.log("summary:", summaryByDate);

  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = summaryByDate.filter((item) => {
    const date = new Date(item.localDate);
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs ">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>作答狀況</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              最近3個月內作答狀況
            </span>
            <span className="@[540px]/card:hidden">最近3個月</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">近3個月</ToggleGroupItem>
              <ToggleGroupItem value="30d">近1個月</ToggleGroupItem>
              <ToggleGroupItem value="7d">近1週</ToggleGroupItem>
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
                <linearGradient id="fillQuestions" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-questions)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-questions)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCorrected" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.645 0.246 16.439)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.645 0.246 16.439)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="localDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("zh-TW", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("zh-TW", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="questions"
                type="natural"
                fill="url(#fillQuestions)"
                stroke="var(--color-questions)"
                stackId="a"
              />
              <Area
                dataKey="corrected"
                type="natural"
                fill="url(#fillCorrected)"
                stroke="oklch(0.645 0.246 16.439)"
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
