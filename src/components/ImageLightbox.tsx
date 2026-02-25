import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  children: (props: { onClick: () => void }) => React.ReactNode;
}

export default function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  return (
    <>
      {children({ onClick: () => setOpen(true) })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 flex items-center justify-center [&>button]:hidden">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 left-3 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
            aria-label="סגור"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={src}
            alt={alt || ""}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
