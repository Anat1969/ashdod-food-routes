import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import type { FoodTruck, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { BarChart3, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*")
        .order("created_at", { ascending: false });
      setTrucks(data || []);
      setLoading(false);
    };
    if (isAdmin) fetch();
  }, [isAdmin]);

  if (authLoading || !isAdmin) return null;

  const stats = {
    total: trucks.length,
    pending: trucks.filter(t => t.status === "submitted").length,
    approved: trucks.filter(t => t.status === "approved").length,
    rejected: trucks.filter(t => t.status === "rejected").length,
  };

  const filteredTrucks = trucks.filter((t) => {
    const matchesSearch = !search || t.truck_name.includes(search);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">לוח בקרה</h1>
        <p className="text-sm text-muted-foreground mt-1">מחלקת הנדסה ותכנון עירוני</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BarChart3} label="סה״כ עמדות" value={stats.total} bgClass="bg-primary/5" iconClass="text-primary" />
        <StatCard icon={Clock} label="ממתינות לבדיקה" value={stats.pending} bgClass="bg-accent/10" iconClass="text-accent" />
        <StatCard icon={CheckCircle} label="מאושרות" value={stats.approved} bgClass="bg-success/10" iconClass="text-success" />
        <StatCard icon={XCircle} label="נדחו" value={stats.rejected} bgClass="bg-destructive/10" iconClass="text-destructive" />
      </div>

      <Card className="municipal-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">רשימת בקשות</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="חיפוש לפי שם..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {(Object.entries(STATUS_LABELS) as [TruckStatus, string][]).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm py-6 text-center">טוען...</p>
          ) : filteredTrucks.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">אין בקשות תואמות</p>
          ) : (
            <div className="space-y-1">
              {filteredTrucks.map((truck, idx) => (
                <div
                  key={truck.id}
                  onClick={() => navigate(`/truck/${truck.id}`)}
                  className={`flex items-center justify-between p-3.5 rounded-lg
                    hover:bg-muted/60 transition-colors cursor-pointer
                    ${idx % 2 === 0 ? "bg-muted/20" : ""}`}
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{truck.truck_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {truck.food_category || "ללא קטגוריה"} · {new Date(truck.created_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, bgClass, iconClass }: {
  icon: React.ElementType; label: string; value: number; bgClass: string; iconClass: string;
}) {
  return (
    <Card className="municipal-shadow border">
      <CardContent className="pt-5 pb-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
