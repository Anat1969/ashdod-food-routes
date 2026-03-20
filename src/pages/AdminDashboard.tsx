import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import type { FoodTruck, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { BarChart3, Clock, CheckCircle, XCircle, Search, Inbox } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import ashdodLogo from "@/assets/ashdod-logo.jpeg";

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
      <div className="container mx-auto px-6 py-10" dir="rtl">
        {/* Executive header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">לוח בקרה</h1>
              <p className="text-xs text-muted-foreground mt-0.5">מחלקת הנדסה ותכנון עירוני · עיריית אשדוד</p>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={BarChart3} label="סה״כ בקשות" value={stats.total} bgClass="bg-primary/6" iconClass="text-primary" />
          <StatCard icon={Clock} label="ממתינות לטיפול" value={stats.pending} bgClass="bg-accent/8" iconClass="text-accent" />
          <StatCard icon={CheckCircle} label="אושרו" value={stats.approved} bgClass="bg-success/8" iconClass="text-success" />
          <StatCard icon={XCircle} label="נדחו" value={stats.rejected} bgClass="bg-destructive/8" iconClass="text-destructive" />
        </div>

        {/* Request list */}
        <Card className="municipal-shadow-lg border-border/60">
          {/* Toolbar */}
          <div className="px-6 pt-6 pb-4 border-b border-border/60">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">בקשות להיתרי הצבה</h2>
              <span className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full font-medium">
                {filteredTrucks.length} תוצאות
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="חיפוש לפי שם עמדה…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-9 h-10 text-sm border-border/80 focus-visible:ring-primary/30"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-10 text-sm border-border/80">
                  <SelectValue placeholder="סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  {(Object.entries(STATUS_LABELS) as [TruckStatus, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">טוען בקשות…</p>
              </div>
            ) : filteredTrucks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {search || statusFilter !== "all" ? "לא נמצאו בקשות התואמות את החיפוש" : "אין בקשות עדיין"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {filteredTrucks.map((truck) => (
                  <div
                    key={truck.id}
                    onClick={() => navigate(`/truck/${truck.id}`)}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer group"
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
                        <span>{new Date(truck.created_at).toLocaleDateString("he-IL")}</span>
                      </div>
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
    <Card className="municipal-shadow border-border/60">
      <CardContent className="pt-5 pb-5 px-5">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
