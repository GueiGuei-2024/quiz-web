'use client'
import { account } from "@/appwrite/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const router = useRouter();
  const [status, setStatus] = useState("驗證中...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get("secret");
    const userId = urlParams.get("userId");

    if (typeof userId === "string" && typeof secret === "string") {
      account
        .updateVerification(userId, secret)
        .then(() => {
          setStatus("✅ 驗證成功！請回到首頁。");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        })
        .catch((err) => {
          console.error(err);
          setStatus("❌ 驗證失敗，請確認連結是否正確。");
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        });
    } else {
      setStatus("❌ 驗證資訊不完整。");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-black">信箱驗證中....</h1>
      <p className="text-black">{status}</p>
    </div>
  );
}
