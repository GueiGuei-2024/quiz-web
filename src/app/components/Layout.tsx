'use client'
import Link from 'next/link';
import { logOut } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";


export default function Layout({ children, isLogin }: { children: React.ReactNode, isLogin:boolean }) {
    const router = useRouter()

    const handleLogout = async ()=>{
        try {
            logOut();
            router.push('/');
        } catch (err){
            alert(`登出失敗： ${err}`)
        }
      }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <Link href="/" className="text-xl font-bold">
          🏠 首頁
        </Link>
        <div className="space-x-4">
          <Link href="/test">考試</Link>
          <Link href="/questions">題目列表</Link>
          <Link href="/analytics">個人分析</Link>
          {isLogin === false
          ?<Button
          >
            <Link href="/login">登入</Link>
          </Button>
          
          :<Button
            onClick={handleLogout}  
          >
            登出
          </Button>}
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
