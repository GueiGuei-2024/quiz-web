import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExamData } from "../types";

const hourMinCal= (seconds:number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      const formatted = `${hours > 0 ? `${hours} 小時 ` : ""}${
        minutes > 0 ? `${minutes} 分鍾 ` : ""
      }${seconds<60 ? `0 分鐘`:""}`;

      return formatted;
    }

function getWeeklyStats(data:ExamData[]) {
  const now = Date.now();
  const oneDay = 86400000;

  const thisWeek = data.filter(
    (d) => Date.parse(d.createdAt) >= now - 7 * oneDay
  );
  const lastWeek = data.filter(
    (d) =>
      Date.parse(d.createdAt) >= now - 14 * oneDay &&
      Date.parse(d.createdAt) < now - 7 * oneDay
  );

  const countThis = thisWeek.length;
  const countLast = lastWeek.length;

  const totalThis = thisWeek.reduce((sum, d) => sum + (d.total_number || 0), 0);
  const totalLast = lastWeek.reduce((sum, d) => sum + (d.total_number || 0), 0);

  const correctThis = thisWeek.reduce((sum, d) => sum + (d.correct || 0), 0);
  const correctRateThis = Math.round((correctThis / totalThis) * 100 );

  const timeSpendThis = thisWeek.reduce((sum, d) => sum + (d.time_consumption || 0), 0);

  const calcRate = (curr:number, prev:number) =>
    prev === 0
      ? curr > 0
        ? 100
        : 0
      : Math.min(100, Math.round(((curr - prev) / prev) * 100));

  return {
    count: {
      thisWeek: countThis,
      lastWeek: countLast,
      change: calcRate(countThis, countLast),
    },
    total: {
      thisWeek: totalThis,
      lastWeek: totalLast,
      change: calcRate(totalThis, totalLast),
    },
    correctRateThis: correctRateThis,
    timeSpendThis: timeSpendThis
  };
}

export function SectionCards({ data }:{data:ExamData[]}) {
  const weekStat = getWeeklyStats(data);
  const totalCorrect = data.reduce((acc, item) => acc + item.correct, 0);
  const totalQuestions = data.reduce((acc, item) => acc + item.total_number, 0);
  const accuracy = Math.round((totalCorrect / totalQuestions) * 100);
  const accuracyChange = weekStat.correctRateThis-accuracy;
  const timeSpend = data.reduce((acc, item) => acc + item.time_consumption, 0);
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本周考試次數</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {weekStat.count.thisWeek}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {weekStat.count.change >= 0 ? <TrendingUp /> : <TrendingDown />}
              {weekStat.count.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {weekStat.count.change >= 0 ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              本周考試次數增加 <TrendingUp className="size-4" />
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium">
              本周考試次數減少 <TrendingDown className="size-4" />
            </div>
          )}
          <div className="text-muted-foreground">
            上週考試次數為 {weekStat.count.lastWeek}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本周作答題數</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {weekStat.total.thisWeek}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {weekStat.total.change >= 0 ? <TrendingUp /> : <TrendingDown />}
              {weekStat.total.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {weekStat.total.change >= 0 ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              本周作答題數增加 <TrendingUp className="size-4" />
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium">
              本周作答題數減少 <TrendingDown className="size-4" />
            </div>
          )}
          <div className="text-muted-foreground">
            上週作答題數為 {weekStat.total.lastWeek}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本周答對率</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {weekStat.correctRateThis}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {accuracyChange>=0?<TrendingUp />:<TrendingDown />}
              {accuracyChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {accuracyChange >= 0 ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              本周答對率增加 <TrendingUp className="size-4" />
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium">
              答對率稍微下降 <TrendingDown className="size-4" />
            </div>
          )}
          <div className="text-muted-foreground">歷史總答對率 {accuracy}%</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本周總計考試作答時間</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {hourMinCal(weekStat.timeSpendThis)}
          </CardTitle>
          
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            歷史累計考試作答時間 
          </div> 
          <div className="text-muted-foreground">{hourMinCal(timeSpend)}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
