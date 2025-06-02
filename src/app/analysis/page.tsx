"use client";
import { fetchExamData } from "@/appwrite/appwrite-anaylsis";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SectionCards } from "./section-card";
import {
  FullscreenLoading,
} from "../components/LoadingAnimation";
import { ModeToggle } from "../components/ModeToggle";
import { ExamData } from "../types";

export default function Analysis() {
  const [data, setData] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchExamData();
        const docs = res?.documents || [];
        setData(docs as ExamData[]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err as Error);
        setLoading(false);
        console.log(error)
      }
    };

    getData();
  }, []);

  const tableData = data.map((item) => {
    const localDate = new Date(item.createdAt);

    return {
      ...item,
      formal_test_type: item.formal_test_type ?? "-",
      localDate: localDate.toLocaleDateString("zh-TW"),
      localDateTime: localDate.toLocaleString("zh-TW"),
      correctRate: (item.correct / item.total_number) * 100,
    };
  });

  const tagStats: Record<string, { C: number; W: number; U: number }> = {};

  data.forEach((item) => {
    item.tag_order.forEach((tag:string, index:number) => {
      const status = item.question_status[index];
      if (!tagStats[tag]) {
        tagStats[tag] = { C: 0, W: 0, U: 0 };
      }
      tagStats[tag][status as "C" | "W" | "U"] += 1;
    });
  });

  // 計算每科的答對率
  Object.entries(tagStats).forEach(([tag, { C, W, U }]) => {
    const total = C + W + U;
    const accuracy = ((C / total) * 100).toFixed(1);
    console.log(`${tag}: ${accuracy}% (${C}/${total})`);
  });
  return (
    <div className="max-w-4xl p-4 my-2 mx-auto border-2 rounded-md">
      {loading && <FullscreenLoading content="資料載入中...." />}
      <div className="flex justify-between px-6">
        <Button onClick={() => router.push("/")}>回首頁</Button>
        
        <ModeToggle/>
        
      </div>
      
      {data.length === 0 && <h1 className="text-4xl font-bold text-center">尚未有任何作答紀錄</h1>}
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={tableData} />
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
}
