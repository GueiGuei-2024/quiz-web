'use client'
import Link from 'next/link';
// import { logOut } from '@/lib/appwrite';
// import { useRouter } from "next/navigation";
import { GraduationCapIcon } from 'lucide-react';


export default function Layout({ children, isLogin }: { children: React.ReactNode, isLogin:boolean }) {
    // const router = useRouter()
    console.log(isLogin)
    // const handleLogout = async ()=>{
    //     try {
    //         logOut();
    //         router.push('/');
    //     } catch (err){
    //         alert(`登出失敗： ${err}`)
    //     }
    //   }

  return (
    <div className="min-h-screen bg-gray-900 text-white dark:bg-gray-900 text-black dark:text-white">
      <nav className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-800">
        <Link href="/" className="text-base md:text-xl font-semibold md:font-bold flex space-x-2 ml-4 md:scale-125 justify-center items-center">
          <GraduationCapIcon/> <span>首頁</span>
        </Link>
        <div className="space-x-5 text-base md:text-xl font-semibold flex justify-center items-center mr-4 flex-wrap">
          <Link href="/test">模擬考試</Link>
          <Link href="/question_review">題目列表</Link>
          <Link href="/contact">聯絡作者</Link>
          {/* <Link href="/analytics">個人分析</Link> */}
          
          {/* {isLogin === false
          ?<Button size={'lg'}
          disabled
          >
            <Link href="/login">登入</Link>
          </Button>
          
          :<Button
          disabled
            onClick={handleLogout}  
          >
            登出
          </Button>} */}
        </div>
      </nav>
      <main className="min-h-[calc(100vh-64px)] p-4 flex justify-center items-start ">{children}</main>
    </div>
  );
}
