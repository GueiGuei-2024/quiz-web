import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotebookPenIcon, GoalIcon, Loader2, Undo2 } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { useState } from "react";
import { getQuestions, fetchPictureURL } from "@/lib/appwrite";
import { Separator } from "@/components/ui/separator";
import { AppwriteQuestion, Question } from "../types";
import Link from "next/link";

const examTimes = ["111-1", "111-2", "112-1", "112-2", "113-1", "113-2"];
const examTypes = ["醫學3", "醫學4", "醫學5", "醫學6"];

type Props = {
  onStart: (
    selectedQuestions: Question[],
    timerMinutes: number,
    ExamType: string
  ) => void;
};
export default function ChooseExamPage({ onStart }: Props) {
  const [numQuestions, setNumQuestions] = useState(80);
  const [randomize, setRandomize] = useState(false);
  // const [timeLimit, setTimeLimit] = useState(120);
  const timeLimit = 120;
  const presetOptions = [5, 10, 20, 40, 80];
  const [selectedExamTimes, setSelectedExamTimes] = useState<string[]>([
    "111-1",
  ]);
  const [selectedExamTypes, setSelectedExamTypes] = useState<string[]>([
    "醫學3",
  ]);
  const [ExamType, setExamType] = useState<string>("quick");

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
            return {
              ...q,
              optionA: opA_pic_url ?? "",
              optionB: opB_pic_url ?? "",
              optionC: opC_pic_url ?? "",
              optionD: opD_pic_url ?? "",
            };
          }
          return q;
        })
      );

      let pool = updated;

      if (ExamType === "quick") {
        const bind = pool.filter((q) => q.bind !== null);
        pool = pool.filter((q) => q.bind === null);
        pool = pool.sort(() => 0.5 - Math.random());
        pool = [...pool, ...bind];
      }

      if (ExamType === "formal" && randomize === true) {
        const bind = pool.filter((q) => q.bind !== null);
        pool = pool.filter((q) => q.bind === null);
        pool = pool.sort(() => 0.5 - Math.random());
        pool = [...bind, ...pool];
      }


      onStart(pool.slice(0, numQuestions), timeLimit, ExamType);

      console.timeEnd("取得題目時間");
    } catch (err) {
      console.error("取得題目錯誤", err);
      alert("題目載入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto h-lvh content-center">
      <Card className="">
        <CardHeader className="relative">
          <div className="justify-self-center md:absolute md:left-0 md:top-0 md:-translate-y-1/2">
            <Link href="/">
              <Button
                variant="outline"
                className="w-auto mx-2 text-semibold mt-1"
              >
                <Undo2 className="scale-100 transition-all "/>
                回首頁
              </Button>
            </Link>
          </div>
          <div className="justify-self-center md:absolute md:right-0 md:top-0 md:-translate-y-1/2">
            <ModeToggle />
          </div>

          <CardTitle className="text-center text-2xl">選擇考試類型</CardTitle>
          

          <CardDescription className="text-center text-xl">
            可以使用[快速考試]或者[正式考試]
          </CardDescription>
        </CardHeader>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="p-4 text-center">
            <Button
              variant="outline"
              className={`w-auto text-xl hover:bg-indigo-300 hover:text-white ${
                ExamType === "quick" && "bg-indigo-500 text-white"
              }`}
              onClick={() => (
                setExamType("quick"),
                setSelectedExamTimes(["111-1"]),
                setSelectedExamTypes(["醫學3"])
              )}
            >
              <NotebookPenIcon />
              快速考試
            </Button>
          </div>
          <div className="p-4 text-center">
            <Button
              variant="outline"
              className={`w-auto  text-xl hover:bg-indigo-300 hover:text-white ${
                ExamType === "formal" && "bg-indigo-500 text-white"
              }`}
              onClick={() => (
                setExamType("formal"),
                setSelectedExamTimes(["111-1"]),
                setSelectedExamTypes(["醫學3"]),
                setNumQuestions(80)
              )}
            >
              <GoalIcon />
              正式考試
            </Button>
          </div>
        </div>
        <div>
          <Separator />
        </div>

        <CardContent>
          <h1 className="text-xl font-bold text-center">選擇題庫</h1>
          <p className="text-sm mb-4 text-center">(請選擇至少一個題庫)</p>
          <div className="flex gap-4 justify-center mb-4 flex-wrap">
            {ExamType === "quick"
              ? examTimes.map((label) => (
                  // <QuestionBankButton
                  //   key={label}
                  //   name={label}
                  //   onClick={() => toggleSelection(label, setSelectedExamTimes)}
                  // />
                  <Button
                    key={label}
                    variant={"outline"}
                    className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                      selectedExamTimes.includes(label) &&
                      "bg-indigo-500 text-white"
                    }`}
                    onClick={() => toggleSelection(label, setSelectedExamTimes)}
                  >
                    {label}
                  </Button>
                ))
              : examTimes.map((label) => (
                  <Button
                    key={label}
                    variant={"outline"}
                    className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                      selectedExamTimes.includes(label) &&
                      "bg-indigo-500 text-white"
                    }`}
                    onClick={() => setSelectedExamTimes([label])}
                  >
                    {label}
                  </Button>
                ))}
          </div>

          <h1 className="text-xl font-bold text-center mt-2">選擇考試類別</h1>
          <p className="text-sm mb-4 text-center">(請選擇至少一考試類別)</p>
          <div className="flex gap-4 justify-center mb-4 flex-wrap">
            {ExamType === "quick"
              ? examTypes.map((label) => (
                  //  <QuestionBankButton
                  //   key={label}
                  //   name={label}
                  //   onClick={() => toggleSelection(label, setSelectedExamTypes)}
                  // />
                  <Button
                    key={label}
                    variant={"outline"}
                    className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                      selectedExamTypes.includes(label) &&
                      "bg-indigo-500 text-white"
                    }`}
                    onClick={() => toggleSelection(label, setSelectedExamTypes)}
                  >
                    {label}
                  </Button>
                ))
              : examTypes.map((label) => (
                  <Button
                    key={label}
                    variant={"outline"}
                    className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                      selectedExamTypes.includes(label) &&
                      "bg-indigo-500 text-white"
                    }`}
                    onClick={() => setSelectedExamTypes([label])}
                  >
                    {label}
                  </Button>
                ))}
          </div>

          {ExamType === "quick" ? (
            <div className="my-4">
              <h1 className="text-xl font-bold text-center mb-2">題目數量</h1>
              <div className="flex gap-4 mb-2 flex-wrap justify-center items-center">
                {presetOptions.map((n) => (
                  <Button
                    variant={"outline"}
                    key={n}
                    className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                      numQuestions === n && "bg-indigo-500 text-white"
                    }`}
                    onClick={() => setNumQuestions(n)}
                  >
                    {n} 題
                  </Button>
                ))}
              </div>
              {/* <input
              type="number"
              min={1}
              max={80}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-auto border rounded px-4 py-2"
            /> */}
            </div>
          ) : (
            <div className="my-4">
              <h1 className="text-xl font-bold text-center mb-2">
                是否隨機選題
              </h1>
              <div className="flex flex-wrap gap-4 my-2 justify-center items-center">
                <Button
                  variant={"outline"}
                  className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                    randomize && "bg-indigo-500 text-white"
                  }`}
                  onClick={() => setRandomize(true)}
                >
                  隨機出題
                </Button>
                <Button
                  variant={"outline"}
                  className={`w-auto px-3 py-1 hover:bg-indigo-300 hover:text-white ${
                    !randomize && "bg-indigo-500 text-white"
                  }`}
                  onClick={() => setRandomize(false)}
                >
                  順序出題
                </Button>
              </div>
            </div>
          )}
          {!loading ? (
            <Button
              onClick={() => handleBegin()}
              className="w-full bg-indigo-500 text-white text-xl font-semibold hover:bg-indigo-300 hover:text-white"
            >
              開始測驗
            </Button>
          ) : (
            <Button
              disabled
              className="w-full bg-indigo-500 text-white text-xl font-semibold hover:bg-indigo-300 hover:text-white"
            >
              <Loader2 className="animate-spin" />
              考題載入中.....
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
