import { useState, useRef } from "react";
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
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!currentUrl) return;

    // Extract path from URL
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
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>

      {currentUrl && isImage && (
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          <img
            src={currentUrl}
            alt={label}
            className="w-full h-32 object-cover"
          />
        </div>
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

      {uploading && (
        <Progress value={progress} className="h-2" />
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {isImage ? <Image className="h-4 w-4 ml-1" /> : <Upload className="h-4 w-4 ml-1" />}
          {uploading ? "מעלה..." : currentUrl ? "החלף" : "העלה"}
        </Button>

        {currentUrl && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
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
