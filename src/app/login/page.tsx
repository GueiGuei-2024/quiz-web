"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, checkLogin, getCurrentUser, logOut } from "@/lib/appwrite";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((userdata) => {
        if (userdata){
            console.log(userdata)           
            router.push("/about")
        } else {
            router.push("/login")
        }
        setLoading(false)
    });
  }, []);

  if (loading) return <div>載入中...</div>

  const handleSignUp = async (email:string, password:string) => {
    try {
      await signUp(email, password);
      alert("註冊成功!");
      router.refresh()
    } catch (error) {
      alert(`註冊fail ! ${error}`);
    }
  };

  const handleLogin = async (email:string, password:string) => {
    try {
      await checkLogin(email, password);
      alert("登入成功!");
      router.push("/");
    } catch (error) {
      alert(`登入失敗，請聯繫網頁製作者! error code: ${error}`);
    }
  };


  const handleLogout = async ()=>{
    try {
        logOut();
        router.push('/');
    } catch (err){
        alert(`登出失敗： ${err}`)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">登入</h2>
          <div className="space-y-2">
            <Label htmlFor="email">信箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleSignUp(email, password)}
          >
            註冊
          </Button>
          <Button
            className="w-full"
            onClick={() => handleLogin(email, password)}
          >
            登入
          </Button>
          <Button
            className="w-full"
            onClick={handleLogout}
          >
            登出
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
