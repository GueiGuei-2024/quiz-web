"use client"

import { useState } from "react"
// import StartPage from "../components/start-page"
import ResultPage from "../components/result-page"
import type { Question, AnswerQuestion } from "../types"
import { createNewCollection } from "@/appwrite/questionbank"
import QuizPage from "../components/quiz-page"
import ChooseExamPage from "../components/choose-exam-page"

export default function QuizEntry() {
  const [stage, setStage] = useState<"start"| "quiz" | "result">("start")
  const [questions, setQuestions] = useState<Question[]>([]) 
  const [answeredQuestions, setAnsweredQuestions] = useState<AnswerQuestion[]>([])
  const [timerMinutes, setTimerMinutes] = useState(120)
  const [timeSpend, setTimeSpend] = useState(0)
  const [examType, setExamType] = useState<string>("quick")

  const handleStart = (selected: Question[], time: number, ExamType:string) => {
  setExamType(ExamType)
  setQuestions(selected)
  setTimerMinutes(time)
  setStage("quiz")
}
  

  const handleFinish = (answers: AnswerQuestion[], timeSpend:number) => {
    setAnsweredQuestions(answers)
    setTimeSpend(timeSpend)
    const currenTime=new Date().toISOString()
    createNewCollection(
      currenTime, 
      answers[0].exam_time, 
      answers[0].exam_type,
      answers.length,
      answers.filter((a) => a.corrected).length,
      answers.filter((a) => a.corrected===false && a.selected).length,
      answers.filter((a) => a.selected===null).length
    )

    setStage("result")
  }

  const handleRestart = () => {
    setQuestions([])
    setStage("start")
  }

  if (stage === "start") {
    return <ChooseExamPage onStart={handleStart} />
  }

  if (stage === "quiz") {
    return <QuizPage questions={questions} timeLimit={timerMinutes} onFinish={handleFinish} examType={examType}/>
  }

  return <ResultPage answeredQuestions={answeredQuestions}  onRestart={handleRestart} timeSpend={timeSpend}/>
}
