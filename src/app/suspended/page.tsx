import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuspendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-6">
        <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-500" />
      </div>
      <h1 className="text-4xl font-heading font-extrabold text-foreground mb-4">Account Suspended</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        Your account has been temporarily suspended by an administrator. You currently do not have access to the platform.
      </p>
      
      <div className="space-x-4">
        <Link href="/help">
          <Button variant="outline">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
