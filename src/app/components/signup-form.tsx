"use client";

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
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {  Loader2Icon, Undo2 } from "lucide-react";
import { signUpWithEmail } from "@/appwrite/appwrite-auth";
import { useState } from "react";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger, // ✅ 用來手動觸發驗證
  } = useForm<SignUpFormData>();
  const password = watch("password");

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    try {
      const result = await signUpWithEmail(data);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push("/login");
      }
    } catch (err) {
      setError(`註冊時發生錯誤: ${err}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">帳號註冊</CardTitle>
          <CardDescription>請輸入以下資料，註冊完成後即可登入!</CardDescription>
          <div className="absolute left-2 top-2 ">
            <HoverCard openDelay={0} closeDelay={0}>
              <HoverCardTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => router.push("./login")}
                  className="cursor-pointer"
                >
                  <Undo2 />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto text-xs text-center font-semibold border rounded-md px-2 py-1 mt-1">
                回登入
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 姓名欄位 */}
            <div className="grid gap-2">
              <Label htmlFor="Name">姓名</Label>
              <Input
                id="name"
                {...register("name", {
                  required: true,
                  maxLength: { value: 8, message: "名字不可超過 8 個字" },
                })}
                placeholder="Name"
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* 信箱欄位 */}
            <div className="grid gap-2">
              <Label htmlFor="email">信箱</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "信箱格式不正確",
                  },
                })}
                placeholder="m@example.com"
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* 密碼欄位 */}
            <div className="grid gap-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "密碼至少 8 個字",
                  },
                  maxLength: {
                    value: 20,
                    message: "密碼最多 20 個字",
                  },
                })}
                placeholder="密碼須介在 8 ~ 20 個字之間"
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 確認密碼欄位 */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">確認密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="請再次輸入密碼"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) => value === password || "密碼不一致",
                })}
                onBlur={() => {
                  trigger("confirmPassword"); // ✅ 當使用者離開欄位時手動觸發驗證
                }}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            {/* 錯誤訊息 */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* 送出按鈕 */}
            <Button
              type="submit"
              className="w-full text-lg font-semibold cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {isSubmitting ? "送出中..." : "送出"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
