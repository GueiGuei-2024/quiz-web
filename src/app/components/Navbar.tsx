"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, logoutUser } from "@/appwrite/appwrite-auth";
import { useState, useEffect} from "react";
import AvatarDropDown from "./AvatarDropDown";
import { AppUser } from "../types";


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
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      logoutUser();
      router.push("/oauth/callback");
    } catch (err) {
      alert(`登出失敗： ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white dark:bg-gray-900 text-black dark:text-white">
      {!isLoading && (
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

            {!isLogin ? (
              <Link href="/login">
                <Button className="cursor-pointer">登入</Button>
              </Link>
            ) : (
              <>
                <AvatarDropDown
                  photourl={userData?.imageUrl}
                  name={userData?.name}
                  email={userData?.email}
                  onLogout={handleLogout}
                />

              </>
            )}
          </div>
        </nav>
      )}
      <main className="min-h-[calc(100vh-64px)] p-4 flex justify-center items-start ">
        {children}
      </main>
    </div>
  );
}
