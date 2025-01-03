"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JWTInspector from "@/components/debug/jwt-inspector";

export default function DebugPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <JWTInspector />
        </CardContent>
      </Card>
    </div>
  );
} 