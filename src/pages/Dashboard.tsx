import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">לוח בקרה</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ברוך הבא!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">מחובר/ת בתור: {user?.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
