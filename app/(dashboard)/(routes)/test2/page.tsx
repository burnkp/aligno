"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
const logger = require("../../../../logger");

interface TestResult {
  success: boolean;
  error?: string;
  data?: any;
  apiKeyAvailable?: boolean;
  apiKeyPrefix?: string;
}

export default function Test2Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const testResend = useAction(api.test.testResend);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    try {
      setIsLoading(true);
      const response = await testResend();
      const result: TestResult = {
        success: response.success,
        error: typeof response.error === 'string' ? response.error : 'Failed to send test email',
        data: response.data,
        apiKeyAvailable: response.apiKeyAvailable,
        apiKeyPrefix: response.apiKeyPrefix,
      };
      setLastResult(result);
      
      if (result.success) {
        toast({
          title: "Test email sent",
          description: "Check your email inbox",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      
      logger.info("Email test result:", result);
    } catch (error) {
      logger.error("Email test failed:", error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTestEmail}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Test Email"}
          </Button>

          {lastResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Last Test Result:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(lastResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 