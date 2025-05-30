"use client";

import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/appwrite/questionbank";
import { FullscreenLoading } from "../components/LoadingAnimation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appwriteConfig, database } from "@/appwrite/client";
import { ID } from "appwrite";
import { Loader2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "../components/ModeToggle";

export default function About() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [report, setReport] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證欄位
    if (!name || !email || !report || !category) {
      setErrorMsg("請完整填寫所有欄位");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Email 格式錯誤");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.contactCollectionId,
        ID.unique(),
        {
          name: name,
          email: email,
          type: category,
          "main-problem": report,
        }
      );

      //   alert("成功送出！我們將盡快回覆你");

      setName("");
      setEmail("");
      setReport("");
      setCategory("");

      // 顯示對話框
      setIsDialogOpen(true);
    } catch (err) {
      console.error("送出失敗:", err);
      setErrorMsg("送出失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser().then((userdata) => {
      if (userdata) {
        setIsLogin(true);
        console.log(userdata);
      } else {
        setIsLogin(false);
      }
    });
    setIsLoading(false);
  }, []);

  return (
    <div>
      {isLoading && <FullscreenLoading content={"等待中..."} />}
      <Layout isLogin={isLogin}>
        <Card className="w-full max-w-xl max-h-[90vh] overflow-auto ">
          <CardHeader className="relative">
            <CardTitle className="text-2xl">聯絡作者</CardTitle>
            <CardDescription>
              輸入你的問題或錯誤回報，我們會在最短時間內寄信給予回覆
            </CardDescription>
            <div className="absolute right-2 top-1 -translate-y-1/2">
            <ModeToggle />
          </div> 
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* 類型選擇 */}
                <div className="grid gap-2">
                  <Label>問題類型</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇問題類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">系統相關</SelectItem>
                      <SelectItem value="account">帳號相關</SelectItem>
                      <SelectItem value="question-bank">題目相關</SelectItem>
                      <SelectItem value="UX">使用者體驗相關</SelectItem>
                      <SelectItem value="Others">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 姓名 */}
                <div className="grid gap-2">
                  <Label htmlFor="name">你的姓名</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">你的 Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* 問題內容 */}
                <div className="grid gap-2">
                  <Label htmlFor="report">你的問題或錯誤回報</Label>
                  <Textarea
                  id="report"
                  placeholder="請輸入具體內容"
                  required
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  className="min-h-[120px]" // 可選：控制高度
                />
                </div>
                

                {/* 錯誤訊息 */}
                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                {/* 送出按鈕 */}
                <Button
                  type="submit"
                  className="w-full text-lg font-semibold"
                  disabled={loading}
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  {loading ? "送出中..." : "送出"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>成功送出表單</AlertDialogTitle>
              <AlertDialogDescription>
                我們會儘快與你聯繫，謝謝你的回報！
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                確認
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </div>
  );
}
