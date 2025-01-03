"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logger from "@/utils/logger";

interface EmailTestResult {
  success: boolean;
  error?: string;
  data?: any;
  apiKeyPresent?: boolean;
  apiKeyPrefix?: string;
  appUrl?: string;
}

export default function EmailDebugPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<EmailTestResult | null>(null);
  // @ts-ignore - Ignoring type inference issues
  const logs = useQuery(api.email.getLogs);
  // @ts-ignore - Ignoring type inference issues
  const testConfig = useAction(api.email.testConfig);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      const result = await testConfig();
      setTestResult(result);
    } catch (error) {
      logger.error("Test failed:", error);
      setTestResult({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
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
            <div className="mt-4 space-y-2">
              <div className={`p-2 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`font-medium ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.success ? 'Test Successful' : 'Test Failed'}
                </p>
              </div>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {logs ? (
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              {JSON.stringify(logs, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">No email logs found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 