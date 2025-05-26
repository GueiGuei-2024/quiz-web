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
    <div >
        {isLoading && <FullscreenLoading content={"等待中..."}/>}
      <Layout isLogin={isLogin}>
        <div className="text-center">
          <h1 className="font-semibold text-2xl my-4">歡迎來到<span className="font-bold text-indigo-500 text-4xl">醫師國考考古題專區</span>!</h1>
          <p>網站測試中，如有bug可連絡製作人員</p>

        </div>
      </Layout>
    </div>
  );
}
