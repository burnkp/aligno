"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";

interface TeamOKRsProps {
  teamId: Id<"teams">;
  userRole: "leader" | "member" | "admin";
}

export function TeamOKRs({ teamId, userRole }: TeamOKRsProps) {
  const allOKRs = useQuery(api.operationalKeyResults.getOperationalKeyResults, {});
  const okrs = allOKRs?.filter(okr => okr.teamId === teamId);

  const canEdit = userRole === "leader" || userRole === "admin";

  if (!okrs || okrs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No operational key results found for this team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Operational Key Results</CardTitle>
        {canEdit && (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add OKR
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {okrs.map((okr) => (
            <div key={okr._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{okr.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {okr.description}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(okr.startDate).toLocaleDateString()} - {new Date(okr.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{okr.progress}%</span>
                </div>
                <Progress value={okr.progress} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 