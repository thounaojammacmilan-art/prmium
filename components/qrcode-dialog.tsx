"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  videoTitle: string;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  videoId,
  videoTitle,
}: QRCodeDialogProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/watch/${videoId}`);
  }, [videoId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share via QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            {url && (
              <QRCodeSVG
                value={url}
                size={200}
                level="M"
                includeMargin
              />
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Scan to watch &ldquo;{videoTitle}&rdquo;
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
