'use client'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { signUpWithEmail } from "@/appwrite/appwrite-auth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 用formData來是是看繳交資料，跟contact中繳交資料的概念不太一樣

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true); 

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    
    const result = await signUpWithEmail({email, password, name})

    if (result?.error){
      setError(result?.error);
    } else if (result?.success){
      router.push("/login")
    }
    setLoading(false)

  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">帳號註冊</CardTitle>
          <CardDescription>
            請輸入以下資料，送出資料後須到信箱進行認證!
          </CardDescription>
        </CardHeader>
        <Separator/>
        <CardContent>
          <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">

                
                <div className="grid gap-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="name"
                    name="name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">信箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    required
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="report">密碼</Label>
                  <Input
                  id="password"
                  placeholder="請輸入你的密碼"
                  name="password"
                  required
                  // value={report}
                  // onChange={(e) => setReport(e.target.value)}
                />
                </div>
                

                {/* 錯誤訊息 */}
                {/* {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>} */}

                {/* 送出按鈕 */}
                <Button
                  type="submit"
                  className="w-full text-lg font-semibold"
                  disabled={loading}
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  {loading ? "送出中..." : "送出"}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
