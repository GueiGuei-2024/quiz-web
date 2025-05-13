import type { Models } from "appwrite";
export type Question = {
  question_number:number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  title:string;
  picture?: string;
  exam_time:string;
  exam_type:string;
  tag:string;
}
export type AppwriteQuestion =Models.Document & {
  question_number:number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  title:string;
  picture?: string;
  exam_time:string;
  exam_type:string;
  tag:string;
}
