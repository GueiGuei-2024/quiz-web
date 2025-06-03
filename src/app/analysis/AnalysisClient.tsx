//未來使用SSR時，登入需要從Server端代理登入!
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { SectionCards } from "./section-card";
// import { DataTable } from "./data-table";
// import { columns } from "./columns";
// import { ModeToggle } from "../components/ModeToggle";
// import { FullscreenLoading } from "../components/LoadingAnimation";
// import { ExamData } from "../types";

// export default function AnalysisClient({ initialData }: { initialData: ExamData[] }) {
//   const [data, setData] = useState(initialData);
//   const [loading, setLoading] = useState(false); // SSR後第一次不需loading
//   const router = useRouter();

//   // 略過再 fetch，除非你有手動 refresh 機制

//   const tableData = data.map((item) => ({
//     ...item,
//     localDate: new Date(item.createdAt).toLocaleDateString("zh-TW"),
//     localDateTime: new Date(item.createdAt).toLocaleString("zh-TW"),
//     correctRate: (item.correct / item.total_number) * 100,
//   }));

//   const tagStats: Record<string, { C: number; W: number; U: number }> = {};
//   data.forEach((item) => {
//     item.tag_order.forEach((tag, index) => {
//       const status = item.question_status[index];
//       if (!tagStats[tag]) tagStats[tag] = { C: 0, W: 0, U: 0 };
//       tagStats[tag][status as "C" | "W" | "U"] += 1;
//     });
//   });

//   return (
//     <div className="max-w-4xl p-4 my-2 mx-auto border-2 rounded-md">
//       {loading && <FullscreenLoading content="資料載入中...." />}
//       <div className="flex justify-between px-6">
//         <Button onClick={() => router.push("/")}>回首頁</Button>
//         <ModeToggle />
//       </div>
//       {data.length === 0 && <h1 className="text-4xl font-bold text-center">尚未有任何作答紀錄</h1>}
//       <div className="@container/main flex flex-1 flex-col gap-2">
//         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//           <SectionCards data={tableData} />
//           <div className="container mx-auto py-10">
//             <DataTable columns={columns} data={tableData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
