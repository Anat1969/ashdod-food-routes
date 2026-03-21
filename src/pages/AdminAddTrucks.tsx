import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import { PlusCircle, FileSpreadsheet, Loader2 } from "lucide-react";

interface Location {
  id: string;
  name: string;
}

export default function AdminAddTrucks() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);

  const [truckName, setTruckName] = useState("");
  
  const [foodCategory, setFoodCategory] = useState("");
  const [locationId, setLocationId] = useState("");

  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    supabase.from("locations").select("id, name").then(({ data }) => {
      setLocations(data || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckName.trim()) {
      toast.error("יש להזין שם פודטראק");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("food_trucks").insert({
      truck_name: truckName.trim(),
      vehicle_type: vehicleType || null,
      food_category: foodCategory || null,
      location_id: locationId || null,
      status: "draft",
    });

    setSaving(false);
    if (error) {
      toast.error("שגיאה בהוספת הפודטראק");
      return;
    }

    toast.success("הפודטראק נוסף בהצלחה");
    setTruckName("");
    setVehicleType("");
    setFoodCategory("");
    setLocationId("");
  };

  // Extract the storage path from the public URL
  const getStoragePath = (url: string): string | null => {
    const marker = "/storage/v1/object/public/documents/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.substring(idx + marker.length);
  };

  const handleImport = async () => {
    if (!docUrl) return;

    const storagePath = getStoragePath(docUrl);
    if (!storagePath) {
      toast.error("לא ניתן לזהות את נתיב הקובץ");
      return;
    }

    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-excel", {
        body: { storage_path: storagePath },
      });

      if (error) {
        toast.error("שגיאה בייבוא הנתונים");
        console.error(error);
        return;
      }

      toast.success(`יובאו ${data.imported} פודטראקים בהצלחה${data.skipped ? ` (${data.skipped} דולגו)` : ""}`);
      if (data.errors?.length) {
        console.warn("Import errors:", data.errors);
      }
      setDocUrl(null);
    } catch (err) {
      toast.error("שגיאה בייבוא הנתונים");
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl" dir="rtl">
        <h1 className="text-2xl font-bold mb-6">הוספת פודטראקים</h1>

        {/* Manual add form */}
        <Card className="municipal-shadow mb-6">
          <CardHeader>
            <CardTitle className="text-lg">הוספה ידנית</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="truckName">שם הפודטראק *</Label>
                <Input
                  id="truckName"
                  value={truckName}
                  onChange={(e) => setTruckName(e.target.value)}
                  placeholder="הזן שם פודטראק"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">סוג רכב</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">משאית</SelectItem>
                    <SelectItem value="trailer">נגרר</SelectItem>
                    <SelectItem value="cart">עגלה</SelectItem>
                    <SelectItem value="stand">דוכן</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foodCategory">קטגוריית אוכל</Label>
                <Input
                  id="foodCategory"
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  placeholder="למשל: המבורגרים, פיצה, אסייאתי"
                />
              </div>

              <div className="space-y-2">
                <Label>מיקום</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מיקום (אופציונלי)" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                <PlusCircle className="h-4 w-4 ml-2" />
                {saving ? "שומר..." : "הוסף פודטראק"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* File upload section */}
        <Card className="municipal-shadow">
          <CardHeader>
            <CardTitle className="text-lg">העלאת קובץ Excel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              העלה קובץ Excel עם רשימת פודטראקים ומתחמים לייבוא אוטומטי.
            </p>
            <FileUpload
              bucket="documents"
              storagePath="admin-uploads"
              currentUrl={docUrl}
              onUploaded={(url) => setDocUrl(url)}
              onDeleted={() => setDocUrl(null)}
              accept=".xlsx,.xls"
              label="קובץ רשימה"
              isImage={false}
            />
            {docUrl && (
              <Button
                onClick={handleImport}
                disabled={importing}
                className="w-full"
                variant="default"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 ml-2" />
                )}
                {importing ? "מייבא נתונים..." : "ייבא נתונים מהקובץ"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}