import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
type AvatarDropDownProps = {
  photourl?: string;
  name: string|undefined;
  email: string|undefined;
  onLogout: () => void;
};

export default function AvatarDropDown({photourl, name, email, onLogout}:AvatarDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger>
            <Avatar>
              <AvatarImage src={photourl? photourl: "/user.png"} />
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto flex flex-col gap-1" align="end" sideOffset={6}>
            <div className="text-base">MdSure 帳號</div>
            <div className="text-sm text-popover-foreground/50">{name}</div>
            <div className="text-sm text-popover-foreground/50">{email}</div>
            </HoverCardContent>
        </HoverCard>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto" align="end" sideOffset={6}>
        <DropdownMenuLabel>我的帳號</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem>個人資料</DropdownMenuItem>
          <DropdownMenuItem>考試紀錄</DropdownMenuItem>
          {/* <DropdownMenuItem>訂閱</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
            登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
