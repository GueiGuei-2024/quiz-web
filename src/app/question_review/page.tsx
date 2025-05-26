"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function CarouselDemo() {


  return (
    <div className="mx-auto max-w-5xl sbg-gray-100 content-center h-full p-6 flex justify-center space-x-4">
      <div className="bg-red-100s w-1/4">
        <div className="justify-self-center mt-4">
            <p>選擇考試時間</p>
          {["111-1", "111-2", "112-1", "112-2", "113-1", "113-2"].map(
            (items, id) => (
              <Button key={id} variant={"outline"} className="w-auto mx-2 my-2">
                {items}
              </Button>
            )
          )}
        </div>
        <div className="justify-self-center mt-4">
            <p>選擇考試類別</p>
          {["醫學3", "醫學4", "醫學5", "醫學6"].map((items, id) => (
            <Button key={id} variant={"outline"} className="w-auto mx-2 my-2">
              {items}
            </Button>
          ))}
        </div>
        <div>
            確認
        </div>
      </div>

      <Carousel className="w-full max-w-xl justify-self-center bg-green-10s0">
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
