"use client";

import { useState, useEffect } from "react";
// import questions_2 from "./test_bank/2025-1-醫學3-questions.json";
// import questions from "./test_bank/2025-1-醫學4-questions.json";
import type { Question, AppwriteQuestion } from "./types";
import { getQuestions } from "../lib/appwrite";
import QuestionBankButton from "./components/Question_bank_button";
import { fetchPictureURL } from "../lib/appwrite";

type Props = {
  onStart: (selectedQuestions: Question[], timerMinutes: number) => void;
};
const labels = ["113-1", "113-2"]; //設定按鈕

export default function StartPage({ onStart }: Props) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labels);
  const [numQuestions, setNumQuestions] = useState(5);
  const [randomize, setRandomize] = useState(true);
  const [mandatoryIndex, setMandatoryIndex] = useState<number | null>(null);
  const [timeLimit, setTimeLimit] = useState(80);
  const [questionbank, setQuestionbank] = useState<AppwriteQuestion[] | null>();
  const presetOptions = [5, 10, 20, 40];

  const handleClick = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
    console.log(selectedLabels);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (selectedLabels.length > 0) {
    setLoading(true);
    console.time("取得題目時間");

    const fetchData = async () => {
      try {
        const res = await getQuestions();
        const data = res.documents.map((doc) => doc as AppwriteQuestion);

        // 遍歷每一題，處理 picture 欄位
        const updated = await Promise.all(
          data.map(async (q) => {
            if (q.picture) {
              const url = await fetchPictureURL(q.picture);
              return { ...q, picture: url };
            }
            return q;
          })
        );

        setQuestionbank(updated);
        console.timeEnd("取得題目時間");
      } catch (err) {
        console.error("取得題目錯誤", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }
}, []);


  const handleBegin = () => {
    if (loading || !questionbank || questionbank.length === 0) return;
    if (selectedLabels.length === 0) return alert("請至少選擇一個題庫!!!");

    let pool = questionbank.filter((obj) =>
      selectedLabels.includes(obj.exam_time)
    );

    console.log(pool);
    if (randomize) pool = pool.sort(() => 0.5 - Math.random());

    if (
      mandatoryIndex !== null &&
      mandatoryIndex >= 1 &&
      mandatoryIndex <= pool.length
    ) {
      const must = pool[mandatoryIndex - 1];
      pool = pool.filter((q) => q !== must);
      const selected = [must, ...pool.slice(0, numQuestions - 1)];
      onStart(selected, timeLimit);
    } else {
      onStart(pool.slice(0, numQuestions), timeLimit);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">選擇測驗設定</h1>
      <h1 className="text-xl font-bold mb-4 text-center">選擇題庫</h1>

      <div className="flex gap-4 justify-center mb-4">
        {labels.map((label) => (
          <QuestionBankButton key={label} name={label} onClick={handleClick} />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">題目數量：</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {presetOptions.map((n) => (
            <button
              key={n}
              className={`px-3 py-1 rounded border hover:bg-blue-100 ${
                numQuestions === n ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setNumQuestions(n)}
            >
              {n} 題
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={80}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-full border rounded px-4 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">是否隨機選題：</label>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded border hover:bg-blue-100 ${
              randomize ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setRandomize(true)}
          >
            隨機
          </button>
          <button
            className={`px-3 py-1 rounded border hover:bg-blue-100 ${
              !randomize ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setRandomize(false)}
          >
            不隨機
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">
          強制包含第幾題（可選）：
        </label>
        <input
          type="number"
          min={1}
          max={80}
          value={mandatoryIndex ?? ""}
          onChange={(e) =>
            setMandatoryIndex(e.target.value ? Number(e.target.value) : null)
          }
          placeholder="輸入題號（例如：3）"
          className="w-full border rounded px-4 py-2"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">時間限制（分鐘）：</label>
        <input
          type="number"
          min={0.1}
          max={80}
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="w-full border rounded px-4 py-2"
        />
      </div>

      <button
        onClick={handleBegin}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold"
      >
        開始測驗
      </button>
    </div>
  );
}
