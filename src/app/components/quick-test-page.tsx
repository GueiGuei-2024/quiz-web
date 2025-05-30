"use client";

import { useState, useEffect } from "react";
import type { Question } from "../types";

type Props = {
  questions: Question[];
  onFinish: (answers: { selected: string; correct: boolean }[]) => void;
  timeLimit: number;
};

//type OptionKey = 'A' | 'B' | 'C' | 'D';
export function QuickQuizPage({ questions, onFinish, timeLimit }: Props) {
  console.log(questions)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    { selected: string; correct: boolean }[]
  >([]);
  const [remainingSeconds, setRemainingSeconds] = useState(timeLimit * 60);

  const normalize = (str: string) => str?.trim().toUpperCase();

  const currentQuestion = questions[currentIndex];
  const correctAnswers: string[] =
    normalize(currentQuestion.answer).match(/[A-D]/g) || [];

  const handleAnswer = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const correct = correctAnswers.includes(normalize(choice));
    setAnswers((prev) => [...prev, { selected: choice, correct }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      onFinish(answers);
    } else {
      setSelected(null);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 倒數計時功能
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setTimeout(() => {
            onFinish(answers);
          }, 0);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between mb-2 text-sm">
        {/* <p>{answers.length}</p> */}
        <div>
          第 {currentIndex + 1} / {questions.length} 題
        </div>
        <div className="text-red-600 font-semibold">
          倒數：{formatTime(remainingSeconds)}
        </div>
      </div>

      <div className="border rounded shadow p-4 mb-4 bg-white">
        <h2 className="text-lg font-bold mb-2">第{currentIndex + 1}題</h2>
        <p className="mb-4">{currentQuestion.question}</p>

        {currentQuestion.picture && (
          <>
            <img
              src={currentQuestion.picture}
              alt="題目圖片"
              className="mx-auto my-2 max-w-full"
            />
          </>
        )}

        {["A", "B", "C", "D"].map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className={`block border w-full text-left rounded-sm px-4 py-2 mb-2 hover:bg-gray-100 ${
              selected !== null
                ? selected === opt
                  ? correctAnswers.includes(normalize(opt))
                    ? "bg-green-300"
                    : "bg-red-300"
                  : correctAnswers.includes(normalize(opt))
                  ? "bg-green-300"
                  : ""
                : ""
            }`}
          >
            {opt}. {currentQuestion[`option${opt}` as keyof Question]}
          </button>
        ))}

        
        <div className="flex">
          {[currentQuestion.exam_time, currentQuestion.exam_type, `第${currentQuestion.question_number}題`].map(
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

        {selected && (
          <div className="mt-4 flex">
            <p className="flex-auto ml-2 py-1.5">
              {correctAnswers.includes(normalize(selected))
                ? `✅ 正確，答案是 ${currentQuestion.answer}`
                : `❌ 錯誤，正確答案是 ${currentQuestion.answer}`}
            </p>
            <button
              onClick={handleNext}
              className="flex-auto px-1 py-1.5 bg-blue-500 text-white rounded"
            >
              下一題
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
