"use client";

import type { Question } from "./types";
import { Bar, Radar } from "react-chartjs-2";
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
  questions: Question[];
  answers: { selected: string; correct: boolean }[];
  onRestart: () => void;
};

export default function ResultPage({ questions, answers, onRestart }: Props) {
  const [chartType, setChartType] = useState<"bar" | "radar">("bar");
  const [filter, setFilter] = useState<
    "all" | "correct" | "wrong" | "unanswered"
  >("all");

  const total = questions.length;
  const correctCount = answers.filter((a) => a.correct).length;
  const unansweredCount = total - answers.length;

  const tagStats: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, i) => {
    const tags = Array.isArray(q.tag) ? q.tag : [q.tag];
    const userAns = answers[i];
    tags.forEach((tag) => {
      if (!tag) return;
      if (!tagStats[tag]) tagStats[tag] = { correct: 0, total: 0 };
      tagStats[tag].total += 1;
      if (userAns?.correct) tagStats[tag].correct += 1;
    });
  });

  const labels = Object.keys(tagStats);
  const correctRates = labels.map((tag) =>
    tagStats[tag].total
      ? (tagStats[tag].correct / tagStats[tag].total) * 100
      : 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "正確率 (%)",
        data: correctRates,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "各標籤正確率分析" },
    },
    scales: { y: { beginAtZero: true, max: 100 } },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "各標籤正確率分析 (雷達圖)" },
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  const filteredQuestions = questions
    .map((q, i) => ({ question: q, index: i }))
    .filter(({ index }) => {
      const ans = answers[index];
      if (filter === "correct") return ans?.correct;
      if (filter === "wrong") return ans && !ans.correct;
      if (filter === "unanswered") return !ans;
      return true;
    });
  console.log(filteredQuestions);
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex-1 border rounded p-4">
          <h1 className="text-xl font-bold mb-4 text-center">答題總結</h1>
          <div className="bg-gray-100 text-center">
            <p className="mb-2">
              答對比率：{((correctCount / total) * 100).toFixed(1)}%
            </p>
            <p className="mb-2">
              答對題數：{correctCount} / {total}
            </p>
            <p className="mb-2">未作答題數：{unansweredCount}</p>
          </div>
          <div className="text-center my-6">
            <button
              onClick={onRestart}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              重新開始
            </button>
          </div>
        </div>

        <div className="flex-1 border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">📊 各 tag 正確率統計</h2>
          {chartType === "bar" ? (
            <Bar data={chartData} options={barOptions} />
          ) : (
            <Radar data={chartData} options={radarOptions} />
          )}
          <div className="text-center mt-4">
            <button
              onClick={() =>
                setChartType(chartType === "bar" ? "radar" : "bar")
              }
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              切換為 {chartType === "bar" ? "雷達圖" : "直方圖"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter("correct")}
          className={`px-3 py-1 rounded ${
            filter === "correct" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          只看正確
        </button>
        <button
          onClick={() => setFilter("wrong")}
          className={`px-3 py-1 rounded ${
            filter === "wrong" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          只看錯誤
        </button>
        <button
          onClick={() => setFilter("unanswered")}
          className={`px-3 py-1 rounded ${
            filter === "unanswered" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          只看未作答
        </button>
      </div>

      {filteredQuestions.map(({ question: q, index }) => {
        const userAns = answers[index] ?? null;
        const correctSet: string[] =
          q.answer.toUpperCase().match(/[A-D]/g) || [];
        const isAnswered = userAns !== null;
        const selected = userAns?.selected;
        const isCorrect = userAns?.correct ?? false;

        return (
          <div
            key={index}
            className={`mb-4 p-4 rounded border ${
              !isAnswered
                ? "border-gray-300"
                : isCorrect
                ? "border-green-400"
                : "border-red-400"
            }`}
          >
            <p className="font-semibold mb-2">
              第 {index + 1} 題：{q.question}
            </p>
            {q.picture && (
              <img
                src={q.picture}
                alt="圖片"
                className="mx-auto max-w-xs mb-2"
              />
            )}

            {["A", "B", "C", "D"].map((opt) => {
              const highlight = !isAnswered
                ? "bg-gray-100"
                : opt === userAns?.selected
                ? correctSet.includes(opt)
                  ? "bg-green-300"
                  : "bg-red-300"
                : correctSet.includes(opt)
                ? "bg-green-300"
                : "bg-gray-100";

              return (
                <div
                  key={opt}
                  className={`ml-2 px-2 py-1 rounded-md inline-block mr-2 mb-1 text-sm ${highlight}`}
                >
                  {opt}. {q[`option${opt}` as keyof Question]}
                </div>
              );
            })}

            <p className="mt-2">
              {isAnswered
                ? `你的答案：${selected}，${
                    isCorrect ? `✅ 正確` : `❌ 錯誤，正確答案是 ${q.answer}`
                  }`
                : `未作答，正確答案是 ${q.answer}`}
            </p>
            <div className="flex">
              {[q.exam_time, q.exam_type, `第${q.question_number}題`, q.tag].map(
                (content, idx) => (
                  <p
                    key={idx}
                    className="flex-none my-4 mx-2 px-4 rounded-sm bg-green-100 w-auto text-center "
                  >
                    {content}
                  </p>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
