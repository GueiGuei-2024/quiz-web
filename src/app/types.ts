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
  picture?: string| null;
  exam_time:string;
  exam_type:string;
  tag:string;
  optionIsPicture?: string|null;
  bind?: string|null ;
  gpt_choice?: string|null;
  gpt_reason?: string|null;
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
  picture?: string| null;
  exam_time:string;
  exam_type:string;
  tag:string;
  optionIsPicture?: string|null;
  bind?: string|null
}

export type AnswerQuestion = Question & {
  selected: string|null;
  corrected: boolean|null;
  index: number;
}

export type AppUser = {
  name: string;
  email: string;
  imageUrl?: string;
  joinedAt?: string;
  accountId: string;
  avatar_name?: string;
  avatar_bg?: string;
};