"use client";

import { useState, useEffect, useRef } from "react";
import type { Question, AnswerQuestion } from "../types";
import { Button } from "@/components/ui/button";
import { JumpToQuestion } from "./JumpToQuestion";
import {
  Card,
  CardHeader,
  CardTitle,
  // CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ModeToggle } from "./ModeToggle";
import { Badge } from "@/components/ui/badge";

type Props = {
  questions: Question[];
  onFinish: (answers: AnswerQuestion[], timeSpend: number) => void;
  timeLimit: number;
  examType: string;
};

export default function FormalQuizPage({
  questions,
  onFinish,
  timeLimit,
  examType,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(timeLimit * 60);

  const normalize = (str: string) => str?.trim().toUpperCase();

  const initialQuizItems = questions.map((q, i) => ({
    ...q,
    index: i,
    selected: null,
    corrected: null,
  }));

  const [quizItems, setQuizItems] =
    useState<AnswerQuestion[]>(initialQuizItems);

  const currentQuestion = quizItems[currentIndex];
  const correctAnswers: string[] =
    normalize(currentQuestion.answer).match(/[A-D]/g) || [];

  const handleAnswer = (itemIndex: number, choice: string) => {
    const correct = correctAnswers.includes(normalize(choice));
    setQuizItems((prev) =>
      prev.map((it) =>
        it.index === itemIndex
          ? { ...it, selected: choice, corrected: correct }
          : it
      )
    );
    console.log(quizItems);
  };

  const handleAnswer_quick = (itemIndex: number, choice: string) => {
    const correct = correctAnswers.includes(normalize(choice));
     
    if (quizItems[itemIndex].selected !==null) return;
      
    setQuizItems((prev) =>
      prev.map((it) =>
        it.index === itemIndex
          ? { ...it, selected: choice, corrected: correct }
          : it
      )
    );
    console.log(quizItems);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizItems.length) {
      alert("已經到最後一題，如果要題目都完成請按[送出答案]");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex - 1 < 0) {
      alert("這是第一題，無法在往前一題");
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const jumpIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const setFinish = (answer: AnswerQuestion[]) => {
    const timespend = timeLimit * 60 - remainingTimeRef.current;
    console.log(timespend);
    if (confirm("確定要送出答案嗎? 送出答案後無法再進行修改。") == true) {
      onFinish(answer, timespend);
    }
  };

  const quizItemsRef = useRef(quizItems);
  useEffect(() => {
    quizItemsRef.current = quizItems;
  }, [quizItems]);

  const remainingTimeRef = useRef(remainingSeconds);

  useEffect(() => {
    remainingTimeRef.current = remainingSeconds;
  }, [remainingSeconds]);

  // 倒數計時功能
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setTimeout(() => {
            alert("時間到，自動交卷!");
            const timespend = timeLimit * 60 - remainingTimeRef.current;
            onFinish(quizItemsRef.current, timespend);
          }, 0);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between mb-2 text-sm">
        {/* <p>{answers.length}</p> */}
        <div>
          第 {currentIndex + 1} / {questions.length} 題
        </div>
        <div className="text-red-600 font-semibold">
          倒數：{formatTime(remainingSeconds)}
        </div>
        <ModeToggle />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>第{currentIndex + 1}題</CardTitle>
        </CardHeader>
        <CardContent>
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

          {examType==="formal"
          ?["A", "B", "C", "D"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(currentIndex, opt)}
              className={`block border-2 w-full text-left rounded-sm px-4 py-2 mb-2 hover:border-green-200   ${
                currentQuestion.selected === opt ? "bg-green-300" : ""
              }`}
            >
              {currentQuestion.optionIsPicture === null ? (
                `${opt}. ${currentQuestion[`option${opt}` as keyof Question]}`
              ) : (
                <>
                  {opt}.
                  <img
                    src={
                      currentQuestion[`option${opt}` as keyof Question] as
                        | string
                        | undefined
                    }
                    className="mx-auto my-2 max-w-full"
                  ></img>
                </>
              )}
            </button>
          ))
        :["A", "B", "C", "D"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer_quick(currentIndex, opt)}
              className={`block border-2 w-full text-left rounded-sm px-4 py-2 mb-2 hover:border-green-200   ${
                currentQuestion.selected    
                  ?currentQuestion.selected === opt 
                    ? correctAnswers.includes(normalize(opt))
                      ? "bg-green-300" 
                      : "bg-red-300"
                    : correctAnswers.includes(normalize(opt))
                      ? "bg-green-300" 
                      : ""
                  :""
              }`}
            >
              {currentQuestion.optionIsPicture === null ? (
                `${opt}. ${currentQuestion[`option${opt}` as keyof Question]}`
              ) : (
                <>
                  {opt}.
                  <img
                    src={
                      currentQuestion[`option${opt}` as keyof Question] as
                        | string
                        | undefined
                    }
                    className="mx-auto my-2 max-w-full"
                  ></img>
                </>
              )}
            </button>
          ))
        
        }

          <div className="flex">
            {[
              currentQuestion.exam_time,
              currentQuestion.exam_type,
              `第${currentQuestion.question_number}題`,
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
        </CardContent>
        {examType==="quick" &&
            <p className="ml-6 ">
                {currentQuestion.selected
                && `${
                    currentQuestion.corrected 
                    ? `✅ 正確，答案是 ${currentQuestion.answer}` 
                    : `❌ 錯誤，正確答案是 ${currentQuestion.answer}`
                  }`
                }
            </p>}
        <CardFooter className="flex justify-between">
          
          <div className="overflow-auto ">
            <Button
              onClick={() => setCurrentIndex(0)}
              className="mx-2 items-center"
            >
              第一題
            </Button>
            <Button onClick={handlePrevious} className="mx-2 ">
              上一題
            </Button>
            <Button onClick={handleNext} className="mx-2 ">
              下一題
            </Button>
            <Button
              onClick={() => setCurrentIndex(quizItems.length - 1)}
              className="mx-2 "
            >
              最後一題
            </Button>
          </div>
          <div>
            <JumpToQuestion quizItems={quizItems} handleIndex={jumpIndex} />
            <Button onClick={() => setFinish(quizItems)} className="mx-2">
              送出答案
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
