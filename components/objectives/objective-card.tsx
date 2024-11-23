"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ObjectiveCardProps {
  objective: {
    _id: string;
    title: string;
    description: string;
    progress: number;
    startDate: string;
    endDate: string;
    teamId: string;
  };
  team?: {
    name: string;
  };
}

export function ObjectiveCard({ objective, team }: ObjectiveCardProps) {
  const timeLeft = formatDistanceToNow(new Date(objective.endDate), { addSuffix: true });

  return (
    <Link href={`/objectives/${objective._id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{objective.title}</CardTitle>
          <Target className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {objective.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{team?.name || "Loading..."}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{objective.progress}%</span>
              </div>
              <Progress value={objective.progress} />
            </div>

            <div className="text-xs text-muted-foreground">
              Due {timeLeft}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}