import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotebookPenIcon, GoalIcon } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

type Props={
  onSetting:()=>void;
}
export default function ChooseExamPage({ onSetting }:Props) {
  const handleSetting = () => {
    onSetting();
  };
  return (
    <div className="p-4 max-w-2xl mx-auto bg-gray-100 h-lvh content-center">
      
      <Card className="">
        <ModeToggle/>
        <CardHeader>
          <CardTitle className="text-2xl">選擇考試類型</CardTitle>
          <CardDescription className="text-xl">可以使用[快速考試]或者[正式考試]</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 text-center">
            <Button
              variant="outline"
              className="w-full mt-4 text-2xl"
              onClick={() => handleSetting()}
            >
              <NotebookPenIcon />
              快速考試
            </Button>
          </div>
          <div className="p-6 text-center">
            <Button
              variant="outline"
              className=" w-full mt-4 text-2xl"
              onClick={() => handleSetting()}
            >
              <GoalIcon />
              正式考試
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
