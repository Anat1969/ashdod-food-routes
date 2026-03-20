import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import type { FoodTruck } from "@/lib/types";
import { Plus, Inbox } from "lucide-react";

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
    <div className="container mx-auto px-4 py-10 max-w-3xl" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">הבקשות שלי</h1>
          <p className="text-sm text-muted-foreground mt-1">מעקב אחרי בקשות הצבת עמדות מזון</p>
        </div>
        <Link to="/apply">
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 ml-1.5" />
            בקשה חדשה
          </Button>
        </Link>
      </div>

      <Card className="municipal-shadow border-border/60">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">טוען בקשות…</p>
            </div>
          ) : trucks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">אין בקשות עדיין</p>
              <p className="text-xs text-muted-foreground">הגישו את הבקשה הראשונה שלכם</p>
              <Link to="/apply">
                <Button variant="outline" size="sm" className="mt-2">הגשת בקשה</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {trucks.map((truck) => (
                <Link
                  key={truck.id}
                  to={`/truck/${truck.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {truck.truck_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {truck.food_category && (
                        <>
                          <span>{truck.food_category}</span>
                          <span className="text-border">·</span>
                        </>
                      )}
                      <span>
                        {truck.submitted_at
                          ? new Date(truck.submitted_at).toLocaleDateString("he-IL")
                          : new Date(truck.created_at).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={truck.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
