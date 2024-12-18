"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface OKR {
  _id: Id<"operationalKeyResults">;
  title: string;
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
  teamId: Id<"teams">;
  strategicObjectiveId: Id<"strategicObjectives">;
}

interface Team {
  _id: Id<"teams">;
  name: string;
  description?: string;
}

interface OKRCardProps {
  okr: OKR;
  team?: Team;
}

export function OKRCard({ okr, team }: OKRCardProps) {
  const startDate = new Date(okr.startDate);
  const endDate = new Date(okr.endDate);
  const progress = Math.round(okr.progress);

  return (
    <Link href={`/objectives/${okr.strategicObjectiveId}/${okr._id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">{okr.title}</CardTitle>
            {team && (
              <div className="text-sm text-muted-foreground">
                Team: {team.name}
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            {okr.description}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}