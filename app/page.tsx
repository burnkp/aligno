import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Aligno
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Streamline your organization's strategic objectives, OKRs, and KPIs in one place.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/sign-in">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}