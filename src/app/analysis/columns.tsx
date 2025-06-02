"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  $id: string;
  createdAt: string;
  test_category: "quick" | "formal" | "custom";
  time_consumption: number;
  total_number: number;
  correct: number;
  wrong: number;
  unanswered: number;
  localDateTime: string;
  correctRate: number;
  formal_test_type: string | null;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "localDateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          作答時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "test_category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          考試類型
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("test_category") as string;

      const typeMap: Record<string, string> = {
        quick: "快速考試",
        formal: "正式考試",
        custom: "自訂考試",
      };

      return typeMap[type] ?? "未知類型";
    },
  },
  {
    accessorKey: "formal_test_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          考試類別
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "correctRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          得分
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "total_number",
    header: "總題數",
  },
  {
    accessorKey: "correct",
    header: "正確題數",
  },
  {
    accessorKey: "wrong",
    header: "錯誤題數",
  },
  {
    accessorKey: "unanswered",
    header: "未作答題數",
  },

  {
    accessorKey: "time_consumption",
    header: "花費時間",
    cell: ({ row }) => {
      const seconds = parseInt(row.getValue("time_consumption"));
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      const formatted = `${hours > 0 ? `${hours} 小時 ` : ""}${
        minutes > 0 ? `${minutes} 分 ` : ""
      }${secs} 秒`;

      return formatted;
    },
  },
];
