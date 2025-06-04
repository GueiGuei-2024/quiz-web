"use client";

import * as React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  PolarAngleAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExamData } from "../types";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  accuracy: {
    label: "正確率(%)",
    color: "oklch(0.645 0.246 16.439)",
  },
} satisfies ChartConfig;

const doctor_3 = [
  { subject: "一般內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "心臟內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "胸腔內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "肝膽腸胃內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "腎臟內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "風濕免疫內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "血液腫瘤內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "內分泌內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "感染內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "家醫科", correct: 0, number: 0, accuracy: 0 },
];

const doctor_4 = [
  { subject: "小兒科", correct: 0, number: 0, accuracy: 0 },
  { subject: "皮膚科", correct: 0, number: 0, accuracy: 0 },
  { subject: "神經內科", correct: 0, number: 0, accuracy: 0 },
  { subject: "精神科", correct: 0, number: 0, accuracy: 0 },
];

const doctor_5 = [
  { subject: "一般外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "心臟外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "胸腔外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "神經外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "整形外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "乳房外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "小兒外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "大腸直腸外科", correct: 0, number: 0, accuracy: 0 },
  { subject: "骨科", correct: 0, number: 0, accuracy: 0 },
  { subject: "泌尿科", correct: 0, number: 0, accuracy: 0 },
];

const doctor_6 = [
  { subject: "麻醉科", correct: 0, number: 0, accuracy: 0 },
  { subject: "眼科", correct: 0, number: 0, accuracy: 0 },
  { subject: "耳鼻喉科", correct: 0, number: 0, accuracy: 0 },
  { subject: "婦產科", correct: 0, number: 0, accuracy: 0 },
  { subject: "復健科", correct: 0, number: 0, accuracy: 0 },
];

function updateDoctorStats(data: ExamData[], doctorArray: typeof doctor_3) {
  data.forEach((item) => {
    item.tag_order.forEach((tag, index) => {
      const target = doctorArray.find((entry) => entry.subject === tag);
      if (target) {
        target.number += 1;
        if (item.question_status[index] === "C") {
          target.correct += 1;
        }
      }
    });
  });

  doctorArray.forEach((entry) => {
    entry.accuracy =
      entry.number > 0 ? Math.round((entry.correct / entry.number) * 100) : 0;
  });
}

export function ChartRadar({ data }: { data: ExamData[] }) {
  const filteredData = data.filter((item) => item.test_category === "formal");
  updateDoctorStats(filteredData, doctor_3);
  updateDoctorStats(filteredData, doctor_4);
  updateDoctorStats(filteredData, doctor_5);
  updateDoctorStats(filteredData, doctor_6);
  const doctorGroups = [
    { name: "醫學3", data: doctor_3 },
    { name: "醫學4", data: doctor_4 },
    { name: "醫學5", data: doctor_5 },
    { name: "醫學6", data: doctor_6 },
  ];
  console.log("doctor:", doctorGroups);
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs ">
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>正式考試分析</CardTitle>
        <CardDescription>
          <span>各科別分析</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {doctorGroups.map((group, idx) => (
            <div
              key={idx}
              className="w-full p-4 flex flex-col justify-center items-center gap-2"
            >
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[220px] w-full"
              >
                <RadarChart data={group.data} >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tickCount={6}
                    axisLine={false}
                    angle={90}
                  />
                  <PolarGrid />
                  <Radar
                    dataKey="accuracy"
                    fill="var(--color-accuracy)"
                    fillOpacity={0.6}
                    stroke="var(--color-accuracy)"
                    strokeWidth={0.4}
                    dot={{
                      r: 2,
                      fillOpacity: 1,
                    }}
                  />
                </RadarChart>
              </ChartContainer>
              <div className="text-2xl text-foreground mt-1">{group.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
