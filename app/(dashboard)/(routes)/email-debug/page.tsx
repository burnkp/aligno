"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const logger = require("../../../../logger");

export default function EmailDebugPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const logs = useQuery(api.debug.checkEmailLogs);
  const testConfig = useAction(api.debug.testEmailConfig);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      const result = await testConfig();
      setTestResult(result);
    } catch (error) {
      logger.error("Test failed:", error);
      setTestResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTest}
            disabled={isLoading}
          >
            {isLoading ? "Testing..." : "Test Email Configuration"}
          </Button>

          {testResult && (
            <pre className="mt-4 p-4 bg-muted rounded-lg overflow-x-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
            {JSON.stringify(logs, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 