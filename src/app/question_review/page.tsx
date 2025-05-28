"use client";
import * as React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getQuestions, fetchPictureURL } from "@/lib/appwrite";
import { AppwriteQuestion, Question } from "../types";
import Link from "next/link";
import { Undo2, CirclePlay, Loader, Loader2 } from "lucide-react";
import { ModeToggle } from "../components/ModeToggle";

export default function CarouselDemo() {
  const [examTime, setExamTime] = useState<string[]>(["111-1"]);
  const [examType, setExamType] = useState<string[]>(["醫學3"]);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStart = async () => {
    setLoading(true);
    setQuestionList([]);
    try {
      console.time("取得題目時間");

      const res = await getQuestions(examTime, examType);
      const data = res.documents.map((doc) => doc as AppwriteQuestion);

      const updated = await Promise.all(
        data.map(async (q) => {
          if (q.picture) {
            const url = await fetchPictureURL(q.picture);
            return { ...q, picture: url };
          }
          return q;
        })
      );

      setQuestionList(updated);
      console.log(updated);
      console.timeEnd("取得題目時間");

      setLoading(false);
    } catch (err) {
      console.error("取得題目錯誤", err);
      alert("題目載入失敗，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full bg-gray-100s content-center h-dvh p-6 flex justify-center space-x-15">
      <Card className="w-1/5 flex-none">
        <div className="relative">
          <p className="justify-self-center font-semibold text-xl mb-2">
            選擇考試時間
          </p>

          <div className="absolute right-0 top-0 -translate-y-1/2">
            <ModeToggle />
          </div>
          <div className="grid grid-cols-2 ">
            {["111-1", "111-2", "112-1", "112-2", "113-1", "113-2"].map(
              (items, id) => (
                <Button
                  key={id}
                  variant={"outline"}
                  className={`w-auto mx-2 my-2 ${
                    examTime.includes(items) && "bg-indigo-500 text-white"
                  }`}
                  onClick={() => setExamTime([items])}
                >
                  {items}
                </Button>
              )
            )}
          </div>
        </div>
        <div className="mt-2">
          <p className="justify-self-center font-semibold text-xl mb-2">
            選擇考試類別
          </p>
          <div className="grid grid-cols-2 ">
            {["醫學3", "醫學4", "醫學5", "醫學6"].map((items, id) => (
              <Button
                key={id}
                variant={"outline"}
                className={`w-auto mx-2 my-2 ${
                  examType.includes(items) && "bg-indigo-500 text-white"
                }`}
                onClick={() => setExamType([items])}
              >
                {items}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 mt-4">
          <Link href="/" className="w-auto mx-2">
          <Button className="w-full">
            <Undo2 />
            回首頁
          </Button>
          </Link>
          {loading ? (
            <Button disabled className="w-auto mx-2 ">
              <Loader className="animate-spin" />
              載入中...
            </Button>
          ) : (
            <Button onClick={() => handleStart()} className="w-auto mx-2">
              <CirclePlay />
              題目設定
            </Button>
          )}
        </div>
      </Card>

      <Carousel className="w-3/5  justify-self-center">
        {!loading ? (
          <CarouselContent>
            {questionList.map((items, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="flex justify-left p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                      <div>{items.question}</div>
                    </CardHeader>
                    <CardContent>
                      {items.picture && (
                        <>
                          <img
                            src={items.picture}
                            alt="題目圖片"
                            className="mx-auto mb-2 max-w-full"
                          />
                        </>
                      )}

                      {["A", "B", "C", "D"].map((opt) => (
                        <p
                          key={opt}
                          //   onClick={() => handleAnswer(currentIndex, opt)}
                          className={`block border-2 w-full text-left rounded-sm px-4 py-2 mb-2  ${
                            items.answer === opt
                              ? "bg-indigo-800 text-white font-semibold"
                              : ""
                          }`}
                        >
                          {items.optionIsPicture === null ? (
                            `${opt}. ${items[`option${opt}` as keyof Question]}`
                          ) : (
                            <>
                              {opt}.
                              <img
                                src={
                                  items[`option${opt}` as keyof Question] as
                                    | string
                                    | undefined
                                }
                                className="mx-auto my-2 max-w-full"
                              ></img>
                            </>
                          )}
                        </p>
                      ))}
                    </CardContent>
                    <CardFooter>
                      {items.question === null ? (
                        <>詳解如下:</>
                      ) : (
                        <>本題還未有詳解</>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : (
          <CarouselContent>
            {Array.from({ length: 1 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex  items-center justify-center p-6 gap-6">
                    <Loader2 className="animate-spin scale-200" />
                    <p className="text-4xl font-semibold">題目載入中</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
