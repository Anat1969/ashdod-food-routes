import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

interface Location {
  id: string;
  name: string;
}

export default function AdminAddTrucks() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);

  const [truckName, setTruckName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [locationId, setLocationId] = useState("");

  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/login");
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    supabase.from("locations").select("id, name").then(({ data }) => {
      setLocations(data || []);
    });
  }, []);

  if (authLoading || !isAdmin) return null;

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
            <CardTitle className="text-lg">העלאת קובץ PDF / Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              ניתן להעלות קובץ PDF או Excel עם רשימת פודטראקים לייבוא.
            </p>
            <FileUpload
              bucket="documents"
              storagePath="admin-uploads"
              currentUrl={docUrl}
              onUploaded={(url) => setDocUrl(url)}
              onDeleted={() => setDocUrl(null)}
              accept=".pdf,.xlsx,.xls"
              label="קובץ רשימה"
              isImage={false}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
