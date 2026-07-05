import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-4 rounded-2xl bg-muted/30 p-6">
        <WifiOff className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">You&apos;re offline</h1>
      <p className="text-center text-muted-foreground">
        Check your internet connection and try again
      </p>
    </div>
  );
}
