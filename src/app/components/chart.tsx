"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PolarAngleAxis, PolarGrid, Radar, RadarChart, PolarRadiusAxis  } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";

const chartConfig = {
  score:{
    label: "正確率(%)",
    color: "oklch(0.645 0.246 16.439)",
  }

} satisfies ChartConfig;

type Props={
    chartdata: { subject: string; score: number }[]; 
    chartype:string;
}

export default function ChartComponent({chartdata, chartype}:Props) {

    const chartData=chartdata
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
       {chartype==="Bar" ? 
       <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} width={500} strokeDasharray="3 3" fill=""/>
        <XAxis
          dataKey="subject"
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => value.slice(0, 4)}
          interval={0}
          angle={-20}
        />
        <YAxis type="number" tickCount={6} dataKey="score" domain={[0, 100]}/>
        <ChartTooltip 
        cursor={false} 
        content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
      </BarChart>
      :<RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} tickCount={6} axisLine={false} angle={90}/>
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.6}
              stroke="var(--color-score)"
              strokeWidth={0.5}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>} 
      
       
    </ChartContainer>
  );
}
