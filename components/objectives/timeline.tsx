"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimelineItem {
  type: "objective" | "okr";
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  objectiveId?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const timelineStart = new Date(Math.min(...items.map(item => item.startDate.getTime())));
  const timelineEnd = new Date(Math.max(...items.map(item => item.endDate.getTime())));
  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));

  const getPositionPercentage = (date: Date) => {
    return ((date.getTime() - timelineStart.getTime()) / (timelineEnd.getTime() - timelineStart.getTime())) * 100;
  };

  const getDurationPercentage = (startDate: Date, endDate: Date) => {
    return ((endDate.getTime() - startDate.getTime()) / (timelineEnd.getTime() - timelineStart.getTime())) * 100;
  };

  return (
    <Card className="p-6">
      <div className="relative min-h-[600px]">
        {/* Timeline header */}
        <div className="absolute top-0 left-0 right-0 h-12 flex">
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date(timelineStart);
            date.setMonth(date.getMonth() + index);
            return (
              <div
                key={index}
                className="flex-1 border-l border-gray-200 p-2 text-xs text-gray-500"
              >
                {format(date, "MMM yyyy")}
              </div>
            );
          })}
        </div>

        {/* Timeline items */}
        <div className="absolute top-12 left-0 right-0 bottom-0">
          {items.map((item, index) => {
            const left = getPositionPercentage(item.startDate);
            const width = getDurationPercentage(item.startDate, item.endDate);

            return (
              <div
                key={item.id}
                className={cn(
                  "absolute h-12 rounded-md px-2 py-1 text-xs font-medium text-white",
                  item.type === "objective" ? "bg-blue-600" : "bg-green-600",
                )}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  top: index * 60 + "px",
                }}
              >
                <div className="flex items-center justify-between h-full">
                  <span className="truncate">{item.title}</span>
                  <span className="ml-2">{item.progress}%</span>
                </div>
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}