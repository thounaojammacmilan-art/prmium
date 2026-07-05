import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-4 text-6xl">404</div>
      <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
      <p className="mb-6 text-center text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="rounded-xl">Go Home</Button>
      </Link>
    </div>
  );
}
