// 'use client';

// import { Button } from "@/components/ui/button";
// import { account } from "@/appwrite/client";
// import { useRouter } from "next/navigation";

// export function LoginUser() {
//   const router = useRouter(); // ✅ Hooks 要在 component 最上層

//   const handleLogin = async () => {
//     try {
//       const session = await account.createSession('current');
//       console.log("登入成功", session);
//       router.push('/'); // ✅ 使用 router
//     } catch (err) {
//       console.error("登入失敗", err);
//     }
//   };

//   return (
//     <Button onClick={handleLogin}>登入</Button>
//   );
// }
