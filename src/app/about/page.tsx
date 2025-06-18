// 'use client'

// import Layout from "../components/Layout";
// import { useState, useEffect } from "react";
// import { getCurrentUser } from "@/appwrite/questionbank";
// import { FullscreenLoading } from "../components/LoadingAnimation";
import Link from "next/link";

import { cookies } from "next/headers";
// import { useRouter } from "next/navigation";
// import { account } from "@/appwrite/client";
import LogoutUser from "./LogoutButton";
import { LoginServer } from "./login-form";
import { getLoggedInUser } from "@/appwrite/appwrite-server";
// const currentLoader= async()=>{
//   try{
//     const user = await account.get()
//     console.log(user)
//   } catch(e){
//     console.log(e)
//   }
//   const session = await account.getSession('current');

// // Provider information
// console.log(session.provider);
// console.log(session.providerUid);
// console.log(session.providerAccessToken);
  
// }

// // currentLoader()
// async function getCurrentUser(){
//   try{
//   const session = await account.get();
//   console.log(session)
//   return session.$id}
//   catch(e){
//     console.log(e)
//     return null
//   }
// }

async function getCurrentUser(){
  try{
  const session = await getLoggedInUser();
  if (!session) return null;
  console.log(session)
  return session.$id}
  catch(e){
    console.log(e)
    return null
  }
}

// async function loginUser(){
//       const session = await account.createEmailPasswordSession(email, password);

//     cookies().set("appwrite-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

export default async function About() {
  // const router = useRouter()
  const userId = await getCurrentUser()
  const ssAsession = (await cookies()).get("appwrite-session")
    
  return (
    <div className="h-screen">
      <div className="h-1/5">測試SSR</div>
      <div className="flex mx-auto gap-10 items-center justify-center h-1/2 bg-gray-500">
        <LoginServer/>
        <Link href={'./login'}>登入</Link>
        <LogoutUser/>
      </div>
      <div>使用者ID為{userId? userId:'未知'}</div>
      <div>目前cookies{ssAsession?.value}</div>
    </div>
      
    
    
  );
}
