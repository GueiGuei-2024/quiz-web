"use client";

import Navbar from "./components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function About() {
  
  return (
    <div>
      <Navbar >
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-8 items-center my-4 overflow-auto">
            <Link href="./test" className="shrink">
              <Button
                variant={"ghost"}
                className="size-auto md:size-60 border-4 text-2xl md:text-4xl font-bold text-gray-400 hover:border-indigo-500 hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                模擬考試
              </Button>
            </Link>
            <Link href="./question_review">
              <Button
                variant={"ghost"}
                className="size-auto md:size-60 border-4 text-2xl md:text-4xl font-bold text-gray-400 hover:border-indigo-500 hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                題目列表
              </Button>
            </Link>
          </div>
          <h1 className="font-semibold text-2xl my-4">
            歡迎來到
            <span className="font-bold text-indigo-500 text-4xl">
              醫師國考考古題專區
            </span>
            !
          </h1>

          <p>網站測試中，如有bug可連絡製作人員</p>
          <div className="mt-4 text-gray-500 text-xl">
            <Link href="./old-version-page">舊版測驗網站</Link>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
