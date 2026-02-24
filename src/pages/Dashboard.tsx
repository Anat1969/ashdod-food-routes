import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import type { FoodTruck } from "@/lib/types";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyTrucks = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*")
        .eq("operator_id", user.id)
        .order("created_at", { ascending: false });
      setTrucks(data || []);
      setLoading(false);
    };
    fetchMyTrucks();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">הבקשות שלי</h1>
          <p className="text-muted-foreground text-sm">מחובר/ת בתור: {user?.email}</p>
        </div>
        <Link to="/apply">
          <Button>
            <Plus className="h-4 w-4 ml-1" />
            בקשה חדשה
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">הפודטראקים שלי</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm py-4 text-center">טוען...</p>
          ) : trucks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">אין לך בקשות עדיין</p>
              <Link to="/apply">
                <Button variant="outline">הגש בקשה ראשונה</Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">שם הפודטראק</TableHead>
                    <TableHead className="text-right">סוג רכב</TableHead>
                    <TableHead className="text-right">קטגוריה</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">תאריך הגשה</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trucks.map((truck) => (
                    <TableRow key={truck.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link to={`/truck/${truck.id}`} className="font-medium text-primary hover:underline">
                          {truck.truck_name}
                        </Link>
                      </TableCell>
                      <TableCell>{truck.vehicle_type || "—"}</TableCell>
                      <TableCell>{truck.food_category || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={truck.status} />
                      </TableCell>
                      <TableCell>
                        {truck.submitted_at
                          ? new Date(truck.submitted_at).toLocaleDateString("he-IL")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
