import { Link } from "react-router-dom";
import {
  Building2, User, Users, Map, ChevronLeft,
  Sparkles, ArrowLeftRight, Bell, CheckCircle2, Eye,
} from "lucide-react";

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            מערכת ניהול פודטראקס
          </h1>
          <p className="text-base opacity-80 leading-relaxed">
            עיריית אשדוד – מחלקת הנדסה ותכנון עירוני
          </p>
          <p className="text-sm opacity-60 mt-2">בחר את תפקידך כדי להתחיל</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-5xl">

        {/* 3 Role Cards — strategic entry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

          {/* Business Owner */}
          <Link
            to="/journey?role=owner"
            className="group relative rounded-3xl border-2 border-gray-100 bg-white p-6
              hover:border-orange-200 hover:shadow-2xl hover:-translate-y-1
              transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500
              opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center
                text-3xl group-hover:scale-110 group-hover:shadow-lg transition-all">
                🚚
              </div>
              <div className="text-center">
                <p className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  בעל עסק
                </p>
                <p className="text-sm font-medium text-orange-600 mb-2">הגש בקשה לפודטראק</p>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[190px]">
                  קרא את המדיניות, הגש בקשה, קבל אישור ופרסם את הפרופיל שלך
                </p>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                text-white bg-gradient-to-l from-orange-500 to-amber-500 shadow-md
                group-hover:shadow-lg transition-all">
                <Sparkles className="w-4 h-4" />
                התחל מסלול
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Municipality */}
          <Link
            to="/journey?role=city"
            className="group relative rounded-3xl border-2 border-gray-100 bg-white p-6
              hover:border-teal-200 hover:shadow-2xl hover:-translate-y-1
              transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-500
              opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center
                text-3xl group-hover:scale-110 group-hover:shadow-lg transition-all">
                🏛️
              </div>
              <div className="text-center">
                <p className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  עירייה
                </p>
                <p className="text-sm font-medium text-teal-600 mb-2">נהל בקשות ומדיניות</p>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[190px]">
                  קבע מדיניות, בדוק בקשות, אשר עמדות ועקוב אחר הפעילות בעיר
                </p>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                text-white bg-gradient-to-l from-teal-600 to-cyan-500 shadow-md
                group-hover:shadow-lg transition-all">
                <Sparkles className="w-4 h-4" />
                התחל מסלול
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Resident */}
          <Link
            to="/map"
            className="group relative rounded-3xl border-2 border-gray-100 bg-white p-6
              hover:border-violet-200 hover:shadow-2xl hover:-translate-y-1
              transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-500
              opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center
                text-3xl group-hover:scale-110 group-hover:shadow-lg transition-all">
                👥
              </div>
              <div className="text-center">
                <p className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-violet-600" />
                  תושב
                </p>
                <p className="text-sm font-medium text-violet-600 mb-2">מצא מקום לאכול</p>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[190px]">
                  גלה עמדות אוכל פעילות בעיר, ראה תפריטים, שעות ואירועים מיוחדים
                </p>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                text-white bg-gradient-to-l from-violet-600 to-purple-500 shadow-md
                group-hover:shadow-lg transition-all">
                <Map className="w-4 h-4" />
                פתח מפה
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </Link>

        </div>

        {/* How the 3 flows connect */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-700">
            <ArrowLeftRight className="w-4 h-4 text-amber-500" />
            איך שלושת המסלולים מתחברים
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">

            <div className="bg-gradient-to-l from-orange-100 to-teal-100 border-l-4 border-teal-400 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-700">הגשת בקשה</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">בעל עסק</span>
                <ArrowLeftRight className="w-3 h-3 text-gray-300" />
                <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">עירייה</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                ברגע שבעל העסק מגיש — העירייה מקבלת התראה ומתחילה תהליך בדיקה אוטומטי
              </p>
            </div>

            <div className="bg-gradient-to-l from-teal-100 to-orange-100 border-l-4 border-orange-400 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-700">החלטת אישור/דחייה</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">עירייה</span>
                <ArrowLeftRight className="w-3 h-3 text-gray-300" />
                <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">בעל עסק</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                החלטת העירייה מועברת מיידית לבעל העסק עם נימוקים ותנאים
              </p>
            </div>

            <div className="bg-gradient-to-l from-orange-100 to-violet-100 border-l-4 border-violet-400 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-700">פרסום ציבורי</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">אישור + בעל עסק</span>
                <ArrowLeftRight className="w-3 h-3 text-gray-300" />
                <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">תושבים</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                לאחר אישור הבקשה ועדכון הפרופיל — העמדה מופיעה למפה הציבורית בזמן אמת
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
