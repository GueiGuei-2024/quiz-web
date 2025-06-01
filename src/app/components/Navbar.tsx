"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCapIcon } from "lucide-react";
import { getUser, logoutUser } from "@/appwrite/appwrite-auth";
import { useState, useEffect } from "react";
import AvatarDropDown from "./AvatarDropDown";
import { AppUser } from "../types";
import AvatarGuest from "./AvatarGuest";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<AppUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setIsLogin(true);
        setUserData(user);
      }
      setIsLoading(false);
      console.log(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      logoutUser();
      // window.location.reload();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      alert(`登出失敗： ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white dark:bg-gray-900 text-black dark:text-white">
      <nav className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-800">
        <Link
          href="/"
          className="text-base md:text-xl font-semibold md:font-bold flex space-x-2 ml-4 md:scale-125 justify-center items-center"
        >
          <GraduationCapIcon /> <span>首頁</span>
        </Link>
        <div className="space-x-5 text-base md:text-xl font-semibold flex justify-center items-center mr-4 flex-wrap">
          <Link href="/test">模擬考試</Link>
          <Link href="/question_review">題目列表</Link>
          <Link href="/contact">聯絡作者</Link>
          {/* <Link href="/analytics">個人分析</Link> */}
          <div className="flex flex-col justify-center items-center">
          {!isLoading && !isLogin ? (
            <AvatarGuest onLogin={() => router.push("./login")} />
          ) : (
            <AvatarDropDown
              photourl={userData?.imageUrl}
              name={userData?.name}
              email={userData?.email}
              onLogout={handleLogout}
              avatar_name={userData?.avatar_name}
              avatar_bg={userData?.avatar_bg}
            />
          )}
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-64px)] p-4 flex justify-center items-start ">
        {children}
      </main>
    </div>
  );
}
