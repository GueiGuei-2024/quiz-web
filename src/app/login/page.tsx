"use client";

import { LoginForm } from "../components/login-form";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <Navbar>
      <div className="flex justify-center items-center h-screen">
        <LoginForm />
      </div>
    </Navbar>
  );
}
