"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface TestResult {
  success: boolean;
  error?: string;
  data?: any;
}

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const testResend = useAction(api.test.testResend);
  const { toast } = useToast();

  const handleTest = async () => {
    try {
      setIsLoading(true);
      const response = await testResend();
      const testResult: TestResult = {
        success: response.success,
        error: typeof response.error === 'string' ? response.error : 'Failed to send test email',
        data: response.data,
      };
      setResult(testResult);
      
      if (testResult.success) {
        toast({
          title: "Test Successful",
          description: "Check your email inbox",
        });
      } else {
        toast({
          title: "Test Failed",
          description: testResult.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Test failed:", error);
      toast({
        title: "Error",
        description: "Failed to run test",
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
          <CardTitle>Resend Configuration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTest}
            disabled={isLoading}
          >
            {isLoading ? "Testing..." : "Test Resend Configuration"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 