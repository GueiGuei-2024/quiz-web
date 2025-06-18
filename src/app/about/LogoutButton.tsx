'use client'
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/appwrite/appwrite-server";

const handleLogout = async () => {
    await logoutUser();
};

export default function LogoutUser() {
  return(
    <Button onClick={handleLogout}>登出</Button>
  )
}