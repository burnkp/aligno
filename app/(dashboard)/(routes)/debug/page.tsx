"use client";

import JWTInspector from "@/components/debug/jwt-inspector";
import { Card } from "@/components/ui/card";

export default function DebugPage() {
  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
        <div className="text-sm text-gray-500 mb-6">
          This page is restricted to super administrators only. It provides detailed information about the JWT claims and authentication state.
        </div>
        <JWTInspector />
      </Card>
    </div>
  );
} 