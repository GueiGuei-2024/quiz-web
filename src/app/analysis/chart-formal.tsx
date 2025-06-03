"use client";

import * as React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
} from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamData } from "../types";

const chartSubjects = ["醫學3", "醫學4", "醫學5", "醫學6"];

function RadialChartItem({
  data,
  exam_type,
}: {
  data: (ExamData&{exam_time:string, exam_type:string})[];
  exam_type: string;
}) {
  const item = data.find((d) => d.exam_type === exam_type);
  const correctRate = item?.correctRate ?? 0;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <RadialBarChart
        width={200}
        height={200}
        data={item ? [item] : []}
        startAngle={0}
        endAngle={(correctRate / 100) * 360}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar
          cornerRadius={10}
          background
          dataKey="correctRate"
          fill="var(--primary)"
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-3xl font-bold"
        >
          {correctRate}%
        </text>
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-sm"
        >
          正確率
        </text>
      </RadialBarChart>
      <div className="text-2xl text-foreground mt-1">{exam_type}</div>
    </div>
  );
}


export function ChartFormal({ data }:{data:ExamData[]}) {
  const [examTime, setExamTime] = React.useState("114-1");
  const chartData = data
    .filter((item) => item.test_category === "formal")
    .map((item) => {
      const [year, term, ...rest] = item.formal_test_type.split("-");
      const exam_time = `${year}-${term}`;
      const exam_type = rest.join("-");

      return {
        ...item,
        exam_time,
        exam_type,
      };
    });

  const filteredChartData = chartData
    .filter((item) => item.exam_time === examTime)
    .reduce((acc: typeof chartData, item) => {
      const existingIndex = acc.findIndex(
        (i) => i.exam_type === item.exam_type
      );

      if (existingIndex === -1) {
        // 尚未存在此 exam_type，直接加入
        acc.push(item);
      } else {
        // 如果已存在此 exam_type，檢查 createdAt，更新為最新
        const existingItem = acc[existingIndex];
        if (new Date(item.createdAt) > new Date(existingItem.createdAt)) {
          acc[existingIndex] = item;
        }
      }

      return acc;
    }, []);
  console.log("filteredChartData:", filteredChartData);
  console.log(
    "filteredChartData:",
    filteredChartData.filter((item) => item.exam_type == "醫學3")
  );

  return (
    <Card className="@container/card">
      <CardHeader >
        <CardTitle>正式考試分析</CardTitle>
        <CardDescription>
          <span >
            最新作答狀況
          </span>
        </CardDescription>
        <CardAction className="mt-2 sm:mt-0">
          <Select value={examTime} onValueChange={setExamTime}>
            <SelectTrigger className="w-auto" size="sm" aria-label="選擇考試別">
              <SelectValue placeholder="選擇考試別" />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-60 overflow-y-auto">
              {[
                "114-1",
                "113-2",
                "113-1",
                "112-2",
                "112-1",
                "111-2",
                "111-1",
              ].map((exam) => (
                <SelectItem key={exam} value={exam} className="rounded-lg">
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
          {chartSubjects.map((subject) => (
            <RadialChartItem
              key={subject}
              data={filteredChartData}
              exam_type={subject}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
