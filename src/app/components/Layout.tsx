import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <Link href="/" className="text-xl font-bold">
          🏠 首頁
        </Link>
        <div className="space-x-4">
          <Link href="/exam">考試</Link>
          <Link href="/questions">題目列表</Link>
          <Link href="/analytics">個人分析</Link>
          <Link href="/login">登入</Link>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
