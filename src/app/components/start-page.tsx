"use client";

import { useState } from "react";
import type { Question, AppwriteQuestion } from "../types";
import { getQuestions } from "../../lib/appwrite";
import QuestionBankButton from "../components/Question_bank_button";
import { fetchPictureURL } from "../../lib/appwrite";
import { FullscreenLoading } from "../components/LoadingAnimation";
import Link from "next/link";

type Props = {
  onStart: (selectedQuestions: Question[], timerMinutes: number) => void;
};

const examTimes = ["113-1", "113-2", "112-1", "112-2", "111-1", "111-2"];
const examTypes = ["醫學3", "醫學4", "醫學5", "醫學6"];

export default function StartPage({ onStart }: Props) {
  const [numQuestions, setNumQuestions] = useState(5);
  const [randomize, setRandomize] = useState(true);
  const [mandatoryIndex, setMandatoryIndex] = useState<number | null>(null);
  const [timeLimit, setTimeLimit] = useState(80);
  const presetOptions = [5, 10, 20, 40];
  const [selectedExamTimes, setSelectedExamTimes] =
    useState<string[]>([]);
  const [selectedExamTypes, setSelectedExamTypes] =
    useState<string[]>([]);
    

  const toggleSelection = (
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((item: string) => item !== value)
        : [...prev, value]
    );
  };

  const [loading, setLoading] = useState(false);

  const handleBegin = async () => {
    console.log(selectedExamTimes);
    console.log(selectedExamTypes);
    if (loading) return;

    if (selectedExamTimes.length === 0 || selectedExamTypes.length === 0) {
      alert("請至少選擇一個 [題庫] 和一個 [考試類別]!!!");
      return;
    }

    try {
      setLoading(true);
      console.time("取得題目時間");

      const res = await getQuestions(selectedExamTimes, selectedExamTypes);
      const data = res.documents.map((doc) => doc as AppwriteQuestion);

      const updated = await Promise.all(
        data.map(async (q) => {
          if (q.picture) {
            const url = await fetchPictureURL(q.picture);
            return { ...q, picture: url };
          }
          if (q.optionIsPicture) {
            const opA_pic_url = await fetchPictureURL(q.optionA);
            const opB_pic_url = await fetchPictureURL(q.optionB);
            const opC_pic_url = await fetchPictureURL(q.optionC);
            const opD_pic_url = await fetchPictureURL(q.optionD);
            return { ...q, 
              optionA: opA_pic_url?? "",
              optionB: opB_pic_url?? "",
              optionC: opC_pic_url?? "",
              optionD: opD_pic_url?? ""
             };
          }
          return q;
        })
      );

      let pool = updated;

      if (mandatoryIndex !== null &&
        mandatoryIndex >= 1 &&
        mandatoryIndex <= pool.length &&
        randomize
      ){
        const must = pool[mandatoryIndex - 1];
        pool = pool.filter((q) => q !== must);
        pool = pool.sort(() => 0.5 - Math.random());
        pool=[must, ...pool] 
      } else if(randomize){
        pool = pool.sort(() => 0.5 - Math.random());
      } 
      
      onStart(pool.slice(0, numQuestions) , timeLimit)
      

      console.timeEnd("取得題目時間");
    } catch (err) {
      console.error("取得題目錯誤", err);
      alert("題目載入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {loading && <FullscreenLoading content={"題目載入中..."}/>}
      
      <h1 className="text-xl font-bold mb-4 text-center">選擇測驗設定</h1>
      <h1 className="text-xl font-bold text-center">選擇題庫</h1>
      <p className="text-m mb-4 text-center">(請選擇至少一個題庫)</p>
      <div className="flex gap-4 justify-center mb-4 flex-wrap">
        {examTimes.map((label) => (
          <QuestionBankButton
            key={label}
            name={label}
            onClick={() => toggleSelection(label, setSelectedExamTimes)}
          />
        ))}
      </div>

      <h1 className="text-xl font-bold text-center">選擇考試類別</h1>
      <p className="text-m mb-4 text-center">(請選擇至少一考試類別)</p>
      <div className="flex gap-4 justify-center mb-4 flex-wrap">
        {examTypes.map((label) => (
          <QuestionBankButton
            key={label}
            name={label}
            onClick={() => toggleSelection(label, setSelectedExamTypes)}
          />
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
      <div className="flex place-content-end">
        <Link href="/about" className="text-gray-200 mt-5 text-left">開發中功能!</Link>
      </div>
    </div>
  );
}
