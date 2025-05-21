import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnswerQuestion } from "../types";

type Props = {
  quizItems: AnswerQuestion[];
  handleIndex:(index:number) => void;
}

export function JumpToQuestion({ quizItems, handleIndex }:Props) {

    const handleClick=(index:number)=>{
        handleIndex(index)
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">答題狀況</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3/4 container mx-auto">
        <ScrollArea className="h-120 sm:max-w-4/5 whitespace-nowrap rounded-md border">
          <div className="p-4 container">
            <DialogHeader className="mt-2 mb-4">
              <DialogTitle className="text-2xl">答題狀況</DialogTitle>
              <DialogDescription className="text-xl">點選題號可以跳轉到該題</DialogDescription>
            </DialogHeader>

            <ScrollArea className="sm:max-w-4/5 max-h-4/5 whitespace-nowrap rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">
                        <Label className="font-semibold">題號</Label>
                    </TableHead>
                    <TableHead>
                        <Label className="font-semibold">你的答案</Label>
                    </TableHead>
                    <TableHead>
                        <Label className="font-semibold">題目</Label>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizItems.map((items) => (
                    <TableRow key={items.index}>
                      <TableCell className="font-medium">
                        <DialogClose asChild>
                            <Button onClick={()=>handleClick(items.index)}>{items.index + 1}</Button>
                        </DialogClose>   
                      </TableCell>
                      <TableCell className={`text-center p-2 font-semibold `}>
                        {items.selected}
                    </TableCell>
                      <TableCell>{items.question}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
