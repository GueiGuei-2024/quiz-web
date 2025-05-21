'use client'

import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { FullscreenLoading } from "../components/LoadingAnimation";

export default function About() {
    const [isLogin, setIsLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
            getCurrentUser().then((userdata) => {
                if (userdata){
                    setIsLogin(true);
                    console.log(userdata)  
                } else {
                    setIsLogin(false);
                }
            });
            setIsLoading(false)
          }, []);
    
    
  return (
    <div>
        {isLoading && <FullscreenLoading content={"等待中..."}/>}
      <Layout isLogin={isLogin}>
        <h1 className="text-2xl font-bold">歡迎來到首頁!</h1>
        <p>網站測試中!</p>
      </Layout>
    </div>
  );
}
