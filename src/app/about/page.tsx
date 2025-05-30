'use client'

// import Layout from "../components/Layout";
// import { useState, useEffect } from "react";
// import { getCurrentUser } from "@/appwrite/questionbank";
// import { FullscreenLoading } from "../components/LoadingAnimation";
import Link from "next/link";
import { logoutUser } from "@/appwrite/appwrite-auth";
import { useRouter } from "next/navigation";
import { account } from "@/appwrite/client";

const currentLoader= async()=>{
  try{
    const user = await account.get()
    console.log(user)
  } catch(e){
    console.log(e)
  }
  const session = await account.getSession('current');

// Provider information
console.log(session.provider);
console.log(session.providerUid);
console.log(session.providerAccessToken);
  
}

currentLoader()

export default function About() {
  const router = useRouter()

  const handleLogout= async()=>{
    await logoutUser();
    router.push('./login')

  }
    
  return (
    <div className="flex gap-10">
        <Link href={'./login'}>登入</Link>
        <button onClick={handleLogout}>
          登出
        </button>
    </div>
  );
}
