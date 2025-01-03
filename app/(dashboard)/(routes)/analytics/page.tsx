"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingState } from "@/components/ui/loading-state";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AnalyticsData {
  teams: any[];
  objectives: any[];
  okrs: any[];
  kpis: any[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [data, setData] = useState<AnalyticsData | null>(null);

  // @ts-ignore - Ignoring type inference issues
  const teams = useQuery(api.teams.getTeams);
  // @ts-ignore - Ignoring type inference issues
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  // @ts-ignore - Ignoring type inference issues
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, { strategicObjectiveId: undefined });
  // @ts-ignore - Ignoring type inference issues
  const kpis = useQuery(api.kpis.getKPIs, {
    operationalKeyResultId: undefined,
    teamId: undefined
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (teams && objectives && okrs && kpis) {
      setData({
        teams,
        objectives,
        okrs,
        kpis
      });
    }
  }, [teams, objectives, okrs, kpis]);

  if (!isLoaded || !data) {
    return <LoadingState />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Teams</h2>
          <p className="text-3xl font-bold">{data.teams.length}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Strategic Objectives</h2>
          <p className="text-3xl font-bold">{data.objectives.length}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">OKRs</h2>
          <p className="text-3xl font-bold">{data.okrs.length}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">KPIs</h2>
          <p className="text-3xl font-bold">{data.kpis.length}</p>
        </Card>
      </div>
    </div>
  );
}