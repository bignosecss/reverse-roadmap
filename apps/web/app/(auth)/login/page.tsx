"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [loginErrors, setLoginErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [registerErrors, setRegisterErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const validateLoginForm = () => {
    const errors: { username?: string; password?: string } = {};
    if (!loginData.username) errors.username = "用户名不能为空";
    if (!loginData.password) errors.password = "密码不能为空";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: { username?: string; email?: string; password?: string } = {};
    if (!registerData.username) {
      errors.username = "用户名不能为空";
    } else if (registerData.username.length < 3) {
      errors.username = "用户名至少需要3个字符";
    }
    if (
      registerData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)
    ) {
      errors.email = "请输入有效的邮箱地址";
    }
    if (!registerData.password) {
      errors.password = "密码不能为空";
    } else if (registerData.password.length < 6) {
      errors.password = "密码至少需要6个字符";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    try {
      await loginMutation.mutateAsync(loginData);
      toast.success("登录成功");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "登录失败，请检查用户名和密码";
      toast.error(message);
    }
  };

  const onRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    try {
      await registerMutation.mutateAsync(registerData);
      toast.success("注册成功，已自动登录");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "注册失败，请稍后重试";
      toast.error(message);
    }
  };

  return (
    <div className="flex-1 flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">欢迎使用 Reverse Roadmap</CardTitle>
          <CardDescription>登录或注册以开始您的目标管理之旅</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={onLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">用户名</Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="请输入用户名"
                    value={loginData.username}
                    onChange={(e) => {
                      setLoginData({ ...loginData, username: e.target.value });
                      if (loginErrors.username)
                        setLoginErrors({ ...loginErrors, username: undefined });
                    }}
                  />
                  {loginErrors.username && (
                    <p className="text-sm text-destructive">
                      {loginErrors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">密码</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="请输入密码"
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      if (loginErrors.password)
                        setLoginErrors({ ...loginErrors, password: undefined });
                    }}
                  />
                  {loginErrors.password && (
                    <p className="text-sm text-destructive">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={onRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">用户名</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="请输入用户名"
                    value={registerData.username}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      });
                      if (registerErrors.username)
                        setRegisterErrors({
                          ...registerErrors,
                          username: undefined,
                        });
                    }}
                  />
                  {registerErrors.username && (
                    <p className="text-sm text-destructive">
                      {registerErrors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">密码</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="请输入密码"
                    value={registerData.password}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      });
                      if (registerErrors.password)
                        setRegisterErrors({
                          ...registerErrors,
                          password: undefined,
                        });
                    }}
                  />
                  {registerErrors.password && (
                    <p className="text-sm text-destructive">
                      {registerErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      注册中...
                    </>
                  ) : (
                    "注册"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
