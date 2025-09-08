"use client";

import { ReactNode } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function ({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success("Copied");
    } else {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="cursor-pointer" onClick={handleCopy}>
      {children}
    </div>
  );
}
