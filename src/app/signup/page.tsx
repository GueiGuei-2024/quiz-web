import { SignUpForm } from "@/app/components/signup-form";
import Navbar from "../components/Navbar";

export default function SingUpPage() {
  return (
    <Navbar>
      <div className="flex justify-center items-center h-screen">
        <SignUpForm />
      </div>
    </Navbar>
  );
}
