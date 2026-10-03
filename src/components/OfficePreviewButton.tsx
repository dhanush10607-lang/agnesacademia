"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Eye, LoaderCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type OfficePreviewButtonProps = {
  filePath: string;
  title: string;
  buttonLabel?: string;
  variant?: "default" | "outline" | "secondary";
  className?: string;
};

type TicketResponse = {
  ticket?: string;
  error?: string;
  detail?: string;
};

const CONVERTER_STARTUP_ATTEMPTS = 30;
const CONVERTER_STARTUP_DELAY_MS = 4000;

export function OfficePreviewButton({
  filePath,
  title,
  buttonLabel = "View File",
  variant = "outline",
  className,
}: OfficePreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  async function convertForPreview() {
    setLoading(true);
    setError("");
    setStatus("Preparing a secure preview request...");

    try {
      const converterUrl = process.env.NEXT_PUBLIC_OFFICE_CONVERTER_URL?.replace(/\/+$/, "");
      if (!converterUrl) {
        throw new Error("The Office preview service is not configured.");
      }

      const ticketResponse = await fetch("/api/office-preview-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });
      const ticketData = (await ticketResponse.json()) as TicketResponse;
      if (!ticketResponse.ok || !ticketData.ticket) {
        throw new Error(ticketData.error || "Could not prepare the Office preview.");
      }

      setStatus("Starting the free preview service. The first request can take about a minute...");
      let serviceReady = false;
      for (let attempt = 0; attempt < CONVERTER_STARTUP_ATTEMPTS; attempt += 1) {
        try {
          const healthResponse = await fetch(`${converterUrl}/health`, {
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
          });
          if (healthResponse.ok) {
            serviceReady = true;
            break;
          }
        } catch {
          // Render's free instance may still be starting up.
        }
        await new Promise((resolve) => setTimeout(resolve, CONVERTER_STARTUP_DELAY_MS));
      }

      if (!serviceReady) {
        throw new Error("The free preview service did not wake up. Please try again shortly.");
      }

      setStatus("Converting the Office document to PDF...");
      const conversionResponse = await fetch(`${converterUrl}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket: ticketData.ticket }),
        signal: AbortSignal.timeout(180_000),
      });
      if (!conversionResponse.ok) {
        const responseData = (await conversionResponse.json().catch(() => null)) as TicketResponse | null;
        throw new Error(responseData?.error || responseData?.detail || "The document could not be converted. Try a smaller file.");
      }

      const contentType = conversionResponse.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/pdf")) {
        throw new Error("The preview service returned an invalid document.");
      }

      const pdfBlob = await conversionResponse.blob();
      setPdfUrl(URL.createObjectURL(pdfBlob));
      setStatus("");
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : "The Office document could not be previewed.",
      );
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (!pdfUrl && !loading) void convertForPreview();
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={handleOpen}
      >
        <Eye className="mr-2 h-4 w-4" />
        {buttonLabel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[90vh] !max-w-6xl grid-rows-[auto_minmax(0,1fr)]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              The file is fetched from Supabase and converted by the Render-hosted free service. Download remains in the original format.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-hidden rounded-lg border bg-muted">
            {pdfUrl ? (
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex justify-end border-b bg-background p-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open PDF in new tab
                  </a>
                </div>
                <iframe
                  key={pdfUrl}
                  src={pdfUrl}
                  title={`PDF preview of ${title}`}
                  className="min-h-0 w-full flex-1"
                />
              </div>
            ) : (
              <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
                {loading && <LoaderCircle className="h-8 w-8 animate-spin text-primary" />}
                <p className="max-w-xl text-sm text-muted-foreground" role={error ? "alert" : "status"}>
                  {error || status}
                </p>
                {error && (
                  <Button type="button" onClick={() => void convertForPreview()}>
                    <Eye className="mr-2 h-4 w-4" />
                    Try preview again
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function FilePreviewButton({
  filePath,
  title,
  buttonLabel = "View File",
  variant = "outline",
  className,
}: OfficePreviewButtonProps) {
  if (/\.(docx?|pptx?)$/i.test(filePath)) {
    return (
      <OfficePreviewButton
        filePath={filePath}
        title={title}
        buttonLabel={buttonLabel}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <a
      href="#file-preview"
      className={buttonVariants({ variant, className })}
    >
      <Eye className="mr-2 h-4 w-4" />
      {buttonLabel}
    </a>
  );
}
