import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, List, PenLine } from "lucide-react";
import ashdodLogo from "@/assets/ashdod-logo.jpeg";

export default function Index() {
  const actions = [
    {
      icon: FileText,
      title: "מדיניות והנחיות",
      description: "צפייה בהנחיות העירייה לפודטראקים במרחב הציבורי",
      to: "/policy",
    },
    {
      icon: List,
      title: "רשימת פודטראקס פעילים",
      description: "מאגר פודטראקים מורשים ומאושרים בעיר אשדוד",
      to: "/directory",
    },
    {
      icon: PenLine,
      title: "הגש בקשה להעמדה",
      description: "הגשת בקשה חדשה להצבת פודטראק במרחב הציבורי",
      to: "/apply",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground/10 p-4 rounded-full">
              <Building2 className="h-12 w-12 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            מערכת ניהול פודטראקס
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            עיריית אשדוד – מחלקת הנדסה ותכנון עירוני
          </p>
          <p className="text-base opacity-60 mt-3 max-w-xl mx-auto">
            ניהול, פיקוח ורישוי פודטראקים במרחב הציבורי של העיר
          </p>
        </div>
      </section>

      {/* Action Cards */}
      <section className="container mx-auto px-4 -mt-8 pb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {actions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="municipal-shadow hover:municipal-shadow-lg transition-shadow cursor-pointer h-full group">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="bg-accent/10 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <action.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{action.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
