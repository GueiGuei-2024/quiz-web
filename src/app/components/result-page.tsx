"use client";

import type { AnswerQuestion, Question } from "../types";
// import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import ChartComponent from "./chart";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

type Props = {
  onRestart: () => void;
  answeredQuestions: AnswerQuestion[];
  timeSpend: number;
};

export default function ResultPage({
  answeredQuestions,
  onRestart,
  timeSpend,
}: Props) {
  const [chartType, setChartType] = useState<"Bar" | "Radar">("Bar");
  const [filter, setFilter] = useState<
    "all" | "correct" | "wrong" | "unanswered"
  >("all");

  const total = answeredQuestions.length;
  const correctCount = answeredQuestions.filter((a) => a.corrected).length;
  const unansweredCount =
    total - answeredQuestions.filter((a) => a.selected).length;

  const tagStats: Record<string, { correct: number; total: number }> = {};

  answeredQuestions.forEach((q) => {
    const tags = Array.isArray(q.tag) ? q.tag : [q.tag];
    //const userAns = answers[i];
    tags.forEach((tag) => {
      if (!tag) return;
      if (!tagStats[tag]) tagStats[tag] = { correct: 0, total: 0 };
      tagStats[tag].total += 1;
      if (q.corrected) tagStats[tag].correct += 1;
    });
  });
  const tagScoreList = Object.entries(tagStats).map(([subject, data]) => {
    const score =
      data.total === 0 ? 0 : Math.round((data.correct / data.total) * 100);
    return { subject, score };
  });

  // 🔍 印出來檢查

  const filteredQuestions = answeredQuestions
    .map((q, i) => ({ question: q, index: i }))
    .filter(({ question }) => {
      if (filter === "correct") return question.corrected;
      if (filter === "wrong")
        return question.selected !== null && !question.corrected;
      if (filter === "unanswered") return question.selected === null;
      return true;
    });
  console.log(filteredQuestions);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="md:flex mb-6 gap-4">
        <Card className="w-full mb-2 md:w-2/5 p-4 border-primary border-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4 text-center">
              答題總結
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center justify-self-center">
              <p className="mb-4">
                答對比率：{((correctCount / total) * 100).toFixed(1)}%
              </p>
              <p className="mb-4">
                答對題數：{correctCount} / {total}
              </p>
              <p className="mb-4">未作答題數：{unansweredCount}</p>
              <p>
                時間花費 : {Math.floor(timeSpend / 60)}分 {timeSpend % 60}秒
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 my-6 justify-center content-center w-full">
              <Button
                onClick={onRestart}
                className="bg-gray-700 text-white px-4 py-2"
              >
                重新開始
              </Button>
              <ModeToggle />
            </div>
          </CardFooter>
        </Card>

        <Card className="w-full mb-2 md:w-3/5 border-primary border-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {chartType} chart{" "}
            </CardTitle>
            <CardDescription className="text-center">
              科別正確率分析
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent chartdata={tagScoreList} chartype={chartType} />
          </CardContent>
          <CardFooter className="flex items-center justify-center w-full">
            <Button
              onClick={() =>
                setChartType(chartType === "Bar" ? "Radar" : "Bar")
              }
              className="bg-gray-700 text-white px-4 py-2"

              // className={`w-auto text-xl hover:bg-indigo-300 hover:text-white `}
            >
              切換為 {chartType === "Bar" ? "雷達圖" : "直方圖"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <Card className="flex-1 border rounded p-4 dark:bg-gray-100">
          <h1 className="text-xl font-bold mb-4 text-center dark:text-black">
            答題總結
          </h1>
          <div className="text-center justify-self-center dark:text-black">
            <p className="mb-2">
              答對比率：{((correctCount / total) * 100).toFixed(1)}%
            </p>
            <p className="mb-2">
              答對題數：{correctCount} / {total}
            </p>
            <p className="mb-2">未作答題數：{unansweredCount}</p>
            <p>
              時間花費:{Math.floor(timeSpend / 60)}分{timeSpend % 60}秒
            </p>
          </div>
          <div className="text-center my-6">
            <button
              onClick={onRestart}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              重新開始
            </button>
            <ModeToggle />
          </div>
        </Card>

        <Card className="flex-1 border rounded p-4 ">
          <h2 className="text-lg font-bold mb-2 dark:text-black text-center">
            📊 答題統計
          </h2>
          {chartType === "Bar" ? (
            <Bar data={chartData} options={barOptions} />
          ) : (
            <Radar data={chartData} options={radarOptions} />
          )}
          <div className="text-center mt-4">
            <Button
              onClick={() =>
                setChartType(chartType === "Bar" ? "Radar" : "Bar")
              }
              
            >
              切換為 {chartType === "Bar" ? "雷達圖" : "直方圖"}
            </Button>
          </div>
        </Card>
      </div> */}

      <div className="flex flex-wrap md:justify-center space-x-2 mb-4">
        <Button
          onClick={() => setFilter("all")}
          className={`bg-gray-700 text-white px-4 py-2 mb-2 md:mb-0 ${
            filter === "all" && "bg-primary text-white"
          }`}
        >
          全部
        </Button>
        <Button
          onClick={() => setFilter("correct")}
          className={`bg-gray-700 text-white px-4 py-2 mb-2 md:mb-0 ${
            filter === "correct" && "bg-primary text-white"
          }`}
        >
          只看正確
        </Button>
        <Button
          onClick={() => setFilter("wrong")}
          className={`bg-gray-700 text-white px-4 py-2 mb-2 md:mb-0 ${
            filter === "wrong" && "bg-primary text-white"
          }`}
        >
          只看錯誤
        </Button>
        <Button
          onClick={() => setFilter("unanswered")}
          className={`bg-gray-700 text-white px-4 py-2 mb-2 md:mb-0 ${
            filter === "unanswered" && "bg-primary text-white"
          }`}
        >
          只看未作答
        </Button>
      </div>

      {filteredQuestions.map(({ question: q }) => {
        const correctSet: string[] =
          q.answer.toUpperCase().match(/[A-D]/g) || [];

        return (
          <Card
            key={q.index}
            className={`mb-5 p-4 rounded border-2 ${
              q.selected === null
                ? "border-gray-300"
                : q.corrected
                ? "border-green-400 dark:border-green-800"
                : "border-red-400 dark:border-red-800"
            }`}
          >
            <div>
              <p className="font-semibold mb-2">
                第 {q.index + 1} 題：{q.question}
              </p>
              {q.picture && (
                <img
                  src={q.picture}
                  alt="圖片"
                  className="mx-auto max-w-xs mb-2"
                />
              )}

              {["A", "B", "C", "D"].map((opt) => {
                const highlight =
                  q.selected === null
                    ? "bg-gray-100 dark:bg-transparent dark:border-2"
                    : opt === q.selected
                    ? correctSet.includes(opt)
                      ? "bg-green-300 dark:bg-green-600"
                      : "bg-red-300 dark:bg-red-600"
                    : correctSet.includes(opt)
                    ? "bg-green-300 dark:bg-green-600"
                    : "bg-gray-100 dark:bg-transparent dark:border-2";

                return (
                  <div
                    key={opt}
                    className={`ml-2 px-2 py-1 rounded-md  ${
                      !q.optionIsPicture && "inline-block"
                    } mr-2 mb-1 text-sm ${highlight}`}
                  >
                    {q.optionIsPicture === null ? (
                      `${opt}. ${q[`option${opt}` as keyof Question]}`
                    ) : (
                      <>
                        {opt}.
                        <img
                          src={
                            q[`option${opt}` as keyof Question] as
                              | string
                              | undefined
                          }
                          className="mx-auto my-2 max-w-full"
                        ></img>
                      </>
                    )}
                  </div>
                );
              })}

              <p className="mt-2">
                {q.selected
                  ? `你的答案：${q.selected}`
                  : `未作答，正確答案是 ${q.answer}`}
              </p>
              <p>
                {q.selected
                  ? `${
                      q.corrected
                        ? `✅ 正確，答案是 ${q.answer}`
                        : `❌ 錯誤，正確答案是 ${q.answer}`
                    }`
                  : ""}
              </p>

              <div className="flex flex-wrap">
                {[
                  q.exam_time,
                  q.exam_type,
                  `第${q.question_number}題`,
                  q.tag,
                ].map((content, idx) => (
                  <Badge
                    key={idx}
                    variant={"secondary"}
                    className="overflow-auto mt-4 mx-2 px-4 rounded-sm w-auto text-center text-md"
                  >
                    {content}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
