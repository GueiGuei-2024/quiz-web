"use client"

import { useState } from "react"
import StartPage from "../components/start-page"
import QuizPage from "../components/quiz-page"
import ResultPage from "../components/result-page"
import type { Question, AnswerQuestion } from "../types"

export default function QuizEntry() {
  const [stage, setStage] = useState<"start" | "quiz" | "result">("start")
  const [questions, setQuestions] = useState<Question[]>([]) 
  const [answeredQuestions, setAnsweredQuestions] = useState<AnswerQuestion[]>([])
  //const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([])
  const [timerMinutes, setTimerMinutes] = useState(80)

  const handleStart = (selected: Question[], time: number) => {
  setQuestions(selected)
  setTimerMinutes(time)
  setStage("quiz")
}

  const handleFinish = (answers: AnswerQuestion[]) => {
    setAnsweredQuestions(answers)
    setStage("result")
  }

  const handleRestart = () => {
    //setAnswers([])
    setQuestions([])
    setStage("start")
  }

  if (stage === "start") {
    return <StartPage onStart={handleStart} />
  }

  if (stage === "quiz") {
    return <QuizPage questions={questions} timeLimit={timerMinutes} onFinish={handleFinish} />
  }

  return <ResultPage answeredQuestions={answeredQuestions}  onRestart={handleRestart} />
}
