'use client'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "@/appwrite/appwrite-server";

type FormValues = {
  email: string;
  password: string;
};

export function LoginServer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const onSubmit = async (data: FormValues) => {
    const email = data.email;
    const password = data.password;
    setError(null);

    const result = await signIn(email, password);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      router.push("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-2">
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  信箱登入
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "信箱格式不正確",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      忘記密碼?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="請輸入密碼"
                    required
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
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <LoaderCircleIcon className="animate-spin" />
                  )}
                  {!isSubmitting ? "登入" : "登入中..."}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
              </div>
              <div className="text-center text-sm flex justify-center items-center gap-2">
                還沒有帳號嗎?
                <Link
                  href="/signup"
                  className="underline-offset-4 hover:underline"
                >
                  點此註冊
                </Link>
              </div>
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
