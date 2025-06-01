import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, } from "@/components/ui/avatar";


export default function AvatarGuest({ onLogin }:{onLogin:()=>void}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger>
            <Avatar>
              <AvatarImage src={"/user.png"} />
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-24 flex flex-col gap-1 text-center"
            align="end"
            alignOffset={-6}
            sideOffset={6}
          >
            <div className="text-sm">MdSure</div>
            <div className="text-xs text-popover-foreground/50">Guest登入</div>
          </HoverCardContent>
        </HoverCard>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-12" align="end" alignOffset={-6} sideOffset={6}>
        <DropdownMenuItem onClick={onLogin} className="cursor-pointer justify-self-center">
          Guest登入
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
