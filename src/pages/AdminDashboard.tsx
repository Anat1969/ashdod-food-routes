import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import type { FoodTruck, Application, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { BarChart3, Clock, CheckCircle, XCircle, Search } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
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
      const [trucksRes, appsRes] = await Promise.all([
        supabase.from("food_trucks").select("*").order("created_at", { ascending: false }),
        supabase.from("applications").select("*").order("submitted_at", { ascending: false }),
      ]);
      setTrucks((trucksRes.data as FoodTruck[]) || []);
      setApplications((appsRes.data as Application[]) || []);
      setLoading(false);
    };
    if (isAdmin) fetch();
  }, [isAdmin]);

  if (authLoading || !isAdmin) return null;

  const stats = {
    total: trucks.length,
    pending: trucks.filter(t => t.status === "ממתין_לבדיקה").length,
    approved: trucks.filter(t => t.status === "מאושר").length,
    rejected: trucks.filter(t => t.status === "נדחה").length,
  };

  const filteredTrucks = trucks.filter((t) => {
    const matchesSearch = !search || t.name.includes(search) || t.operator_name.includes(search);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingApps = applications.filter(a => a.status === "ממתין_לבדיקה");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">לוח בקרה – אדריכל העיר</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BarChart3} label="סה״כ פודטראקים" value={stats.total} color="text-primary" />
        <StatCard icon={Clock} label="ממתינים לבדיקה" value={stats.pending} color="text-accent" />
        <StatCard icon={CheckCircle} label="מאושרים" value={stats.approved} color="text-success" />
        <StatCard icon={XCircle} label="נדחו" value={stats.rejected} color="text-destructive" />
      </div>

      {/* Pending Applications */}
      {pendingApps.length > 0 && (
        <Card className="municipal-shadow mb-8">
          <CardHeader>
            <CardTitle className="text-lg">בקשות חדשות ממתינות ({pendingApps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{app.applicant_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.food_category} • {app.requested_neighborhood} • {new Date(app.submitted_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Truck Management */}
      <Card className="municipal-shadow">
        <CardHeader>
          <CardTitle className="text-lg">ניהול פודטראקים</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="חיפוש..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
            <p className="text-muted-foreground text-sm">טוען...</p>
          ) : filteredTrucks.length === 0 ? (
            <p className="text-muted-foreground text-sm">אין פודטראקים</p>
          ) : (
            <div className="space-y-2">
              {filteredTrucks.map((truck) => (
                <div
                  key={truck.id}
                  onClick={() => navigate(`/truck/${truck.id}`)}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{truck.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {truck.operator_name} • {truck.neighborhood || "ללא שכונה"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{new Date(truck.created_at).toLocaleDateString("he-IL")}</span>
                    <StatusBadge status={truck.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <Card className="municipal-shadow">
      <CardContent className="pt-6 flex items-center gap-3">
        <Icon className={`h-8 w-8 ${color} flex-shrink-0`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
