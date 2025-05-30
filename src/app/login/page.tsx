"use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { signUp, checkLogin, getCurrentUser, logOut } from "@/appwrite/questionbank";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(true)
  // const router = useRouter();

  // useEffect(() => {
  //   getCurrentUser().then((userdata) => {
  //       if (userdata){
  //           console.log(userdata)           
  //           // router.push("/about")
  //       } else {
  //           router.push("/login")
  //       }
  //       setLoading(false)
  //   });
  // }, []);

  // if (loading) return <div>載入中...</div>

  // const handleSignUp = async (email:string, password:string) => {
  //   try {
  //     await signUp(email, password);
  //     alert("註冊成功!");
  //     router.refresh()
  //   } catch (error) {
  //     alert(`註冊fail ! ${error}`);
  //   }
  // };

  // const handleLogin = async (email:string, password:string) => {
  //   try {
  //     await checkLogin(email, password);
  //     alert("登入成功!");
  //     router.push("/");
  //   } catch (error) {
  //     alert(`登入失敗，請聯繫網頁製作者! error code: ${error}`);
  //   }
  // };


  // const handleLogout = async ()=>{
  //   try {
  //       logOut();
  //       router.push('/');
  //   } catch (err){
  //       alert(`登出失敗： ${err}`)
  //   }
  // }

  return (
    <div className="flex justify-center items-center h-screen">
      <LoginForm/>
    </div>
  );
}
