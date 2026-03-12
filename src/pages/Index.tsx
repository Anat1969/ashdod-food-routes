import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ClipboardList, PenLine, Map, ChevronLeft, GitBranch } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { user } = useAuth();

  const businessActions = [
    {
      icon: FileText,
      title: "מדיניות והנחיות",
      description: "קרא את דרישות העירייה לפני הגשת הבקשה",
      to: "/policy",
    },
    {
      icon: PenLine,
      title: "הגש בקשה להעמדה",
      description: "הגשת בקשה חדשה להצבת פודטראק במרחב הציבורי",
      to: "/apply",
    },
    {
      icon: ClipboardList,
      title: user ? "הבקשות שלי" : "כניסה למערכת",
      description: user ? "מעקב אחרי סטטוס הבקשות שהגשת" : "התחבר/י כדי לנהל את הבקשות שלך",
      to: user ? "/dashboard" : "/login",
    },
  ];

  return (
    <div dir="rtl">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-14 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            מערכת ניהול פודטראקס
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
            עיריית אשדוד – מחלקת הנדסה ותכנון עירוני
          </p>
        </div>
      </section>

      {/* Resident CTA */}
      <section className="bg-accent/10 border-b">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">מחפש מקום לאכול?</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                גלה את כל עמדות האוכל הפעילות בעיר — תפריט, מחירים ומיקום
              </p>
            </div>
            <Link
              to="/map"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Map className="h-4 w-4" />
              מפת עמדות האוכל
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Journey Map CTA */}
      <section className="bg-gradient-to-l from-orange-50 via-teal-50 to-violet-50 border-b">
        <div className="container mx-auto px-4 py-5 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-teal-600" />
                מפת מסלולי המשתמשים
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                תרשים זרימה לבעל עסק, עירייה ותושב — ראה מה כל גורם עושה ואיפה הם מתחברים
              </p>
            </div>
            <Link
              to="/journey"
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-teal-700 transition-colors whitespace-nowrap"
            >
              <GitBranch className="h-4 w-4" />
              צפה במפת הדרכים
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Business owner section */}
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold">בעל עסק? הגש בקשה להעמדת פודטראק</h2>
          <p className="text-sm text-muted-foreground mt-1">
            תהליך הגשת הבקשה, בדיקת הציות ומעקב סטטוס — הכל במקום אחד
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {businessActions.map((action, i) => (
            <Link key={action.to} to={action.to}>
              <Card className="municipal-shadow hover:municipal-shadow-lg transition-shadow cursor-pointer h-full group">
                <CardContent className="pt-7 pb-6 text-center">
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                      <action.icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mb-1.5">{action.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
