import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { MousePointerClick, MousePointerBan } from "lucide-react";

type ToggleDragModeProps = {
  onToggle: () => void;
  status:boolean;
}


export default function ToggleDragMode({ onToggle, status }: ToggleDragModeProps) {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="outline" size="icon" onClick={()=>{onToggle()}}>
            {status
            ?<MousePointerBan/>
            :<MousePointerClick />
            }
          
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <div className="text-xs text-center font-semibold border rounded-md px-2 py-1 mt-1">
            {status
            ?"滑動解鎖"
            :"滑動鎖定"
            }
        </div>
        </HoverCardContent>
    </HoverCard>
  );
}
