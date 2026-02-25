import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Upload, Trash2, FileText, Image } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import { toast } from "sonner";

interface FileUploadProps {
  bucket: "truck-photos" | "documents" | "avatars";
  storagePath: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  onDeleted: () => void;
  accept?: string;
  label: string;
  isImage?: boolean;
  className?: string;
}

export default function FileUpload({
  bucket,
  storagePath,
  currentUrl,
  onUploaded,
  onDeleted,
  accept,
  label,
  isImage = true,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const isAccepted = useCallback(
    (file: File): boolean => {
      if (!accept) return true;
      const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
      const mime = file.type.toLowerCase();
      return acceptedTypes.some(
        (a) =>
          a === ext ||
          a === mime ||
          (a.endsWith("/*") && mime.startsWith(a.replace("/*", "/")))
      );
    },
    [accept]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      if (!isAccepted(file)) {
        toast.error("סוג הקובץ אינו נתמך");
        return;
      }

      setUploading(true);
      setProgress(10);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${storagePath}/${fileName}`;

      setProgress(30);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (error) {
        toast.error("שגיאה בהעלאת הקובץ");
        setUploading(false);
        setProgress(0);
        return;
      }

      setProgress(80);

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      onUploaded(urlData.publicUrl);
      toast.success("הקובץ הועלה בהצלחה");

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    },
    [bucket, storagePath, onUploaded, isAccepted]
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          await uploadFile(file);
          return;
        }
      }
    }
  };

  const handleDelete = async () => {
    if (!currentUrl) return;
    const urlParts = currentUrl.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length < 2) {
      onDeleted();
      return;
    }
    const path = urlParts[1];
    await supabase.storage.from(bucket).remove([path]);
    onDeleted();
    toast.success("הקובץ נמחק");
  };

  return (
    <div
      className={`flex flex-col rounded-lg border-2 border-dashed p-3 transition-colors outline-none ${
        dragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25 hover:border-muted-foreground/40"
      } ${className || ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <p className="text-sm font-medium mb-2">{label}</p>

      {currentUrl && isImage && (
        <ImageLightbox src={currentUrl} alt={label}>
          {({ onClick }) => (
            <div className="relative rounded-lg overflow-hidden border bg-muted flex-1 min-h-[8rem] cursor-zoom-in" onClick={onClick}>
              <img
                src={currentUrl}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </ImageLightbox>
      )}

      {currentUrl && !isImage && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors text-sm"
        >
          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate">צפה בקובץ</span>
        </a>
      )}

      {!currentUrl && !uploading && (
        <p className="text-xs text-muted-foreground text-center py-2">
          גרור קובץ לכאן, הדבק, או לחץ להעלאה
        </p>
      )}

      {uploading && <Progress value={progress} className="h-2" />}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {isImage ? (
            <Image className="h-4 w-4 ml-1" />
          ) : (
            <Upload className="h-4 w-4 ml-1" />
          )}
          {uploading ? "מעלה..." : currentUrl ? "החלף" : "העלה"}
        </Button>

        {currentUrl && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>מחיקת קובץ</AlertDialogTitle>
                <AlertDialogDescription>
                  האם אתה בטוח שברצונך למחוק את הקובץ? לא ניתן לבטל פעולה זו.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>מחק</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
