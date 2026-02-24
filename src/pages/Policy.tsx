import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PolicyRow {
  requirement: string;
  details: string;
}

interface PolicySection {
  id: string;
  title: string;
  rows: PolicyRow[];
}

const policySections: PolicySection[] = [
  {
    id: "aesthetics",
    title: "I. חזות, מיתוג ואסתטיקה",
    rows: [
      { requirement: "עיצוב מקצועי", details: "חזות מסחרית מקצועית, עטיפת רכב (ויניל) מלאה או חלקית בעיצוב אחיד ואיכותי." },
      { requirement: "שילוט", details: "שלט עסק קריא, ממותג, מואר בשעות החשכה. גודל מותאם לרכב, לא בולט מעבר לגבולות הרכב." },
      { requirement: "תפריט מוצג", details: "לוח תפריט נגיש, קריא, בעברית עם תרגום אופציונלי. גופן מינימלי 14pt." },
      { requirement: "צבעוניות ומיתוג", details: "צבעוניות אחידה ועקבית עם מיתוג העסק. ללא פרסום חיצוני או שילוט שאינו קשור לעסק." },
      { requirement: "תאורה", details: "תאורה פנימית וחיצונית מותאמת. ללא תאורה מסנוורת או מהבהבת." },
      { requirement: "אישור חזות מהעירייה", details: "כל שינוי בחזות הרכב מחייב אישור מראש ממחלקת הנדסה." },
    ],
  },
  {
    id: "operations",
    title: "II. תפעול, מיקום ושימוש במרחב הציבורי",
    rows: [
      { requirement: "מרחק מקו אבן השפה", details: "מינימום 60 ס\"מ מקו אבן השפה לכיוון המדרכה." },
      { requirement: "אי חסימת רהוט רחוב", details: "אסור לחסום ספסלים, פחי אשפה, עמודי תאורה, תחנות אוטובוס וכדומה." },
      { requirement: "שעות פעילות", details: "פעילות מותרת בין 08:00–23:00 בימי חול, 10:00–24:00 בסופי שבוע, אלא אם נקבע אחרת." },
      { requirement: "ניקיון סביבה", details: "ניקוי מיידי של אזור הפעילות בסיום כל יום עבודה. פינוי שומנים ושפכים כנדרש." },
      { requirement: "רעש", details: "עמידה בתקני רעש עירוניים. אין להפעיל מוזיקה מוגברת ללא אישור." },
      { requirement: "חניה ותנועה", details: "אין לחסום נתיב תנועה, חניה, מעבר חירום או כניסה לבניין." },
      { requirement: "מיקום קבוע", details: "הפעלה במיקום שאושר בלבד. שינוי מיקום מחייב אישור מחדש." },
    ],
  },
  {
    id: "safety",
    title: "III. בטיחות, בריאות ותחזוקה",
    rows: [
      { requirement: "מטבח קצה בלבד", details: "הכנה סופית בלבד ברכב. חומרי גלם מגיעים ממטבח מוסדי מאושר." },
      { requirement: "מערכת כיבוי אש", details: "מטף כיבוי אש תקני (6 ק\"ג אבקה יבשה מינימום), בבדיקה שנתית." },
      { requirement: "גז ואינסטלציה", details: "מערכת גז תקנית עם אישור טכנאי גז מוסמך. ניתוק מרכזי נגיש." },
      { requirement: "מים ושפכים", details: "מיכל מים נקיים (40 ליטר מינימום) ומיכל שפכים נפרד. פינוי שפכים מסודר." },
      { requirement: "חשמל", details: "מערכת חשמל עם פחת ומפסק ראשי. אין חיבור לתשתית ציבורית ללא אישור." },
      { requirement: "תברואה", details: "משטח עבודה מנירוסטה, כיור עם מים חמים וקרים, ציוד חד-פעמי או רחיץ." },
      { requirement: "רישיון עסק", details: "רישיון עסק תקף, כולל אישור משרד הבריאות." },
    ],
  },
  {
    id: "accessibility",
    title: "IV. דרישות נגישות",
    rows: [
      { requirement: "גובה דלפק שירות", details: "מקסימום 110 ס\"מ. מומלץ חלק נמוך בגובה 80 ס\"מ לנגישות כיסא גלגלים." },
      { requirement: "רוחב נתיב גישה", details: "מינימום 90 ס\"מ נתיב גישה פנוי לפדסטריאנים, כולל משתמשי כיסאות גלגלים." },
      { requirement: "תפריט נגיש", details: "גופן קריא, ניגודיות גבוהה. אפשרות לתפריט בברייל או דיגיטלי." },
      { requirement: "משטח ישר", details: "פעילות על משטח ישר וסלול בלבד, ללא מדרגות או מכשולים." },
      { requirement: "סימון ומיקום", details: "ריצפת הקמה ללא מכשולים. מרחב תמרון מספיק לכיסא גלגלים (150x150 ס\"מ)." },
    ],
  },
];

export default function Policy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">מדיניות והנחיות</h1>
      <p className="text-muted-foreground mb-8">
        הנחיות עיריית אשדוד להצבת פודטראקים במרחב הציבורי – מחלקת הנדסה ותכנון עירוני
      </p>

      <Accordion type="multiple" className="space-y-3">
        {policySections.map((section) => (
          <AccordionItem key={section.id} value={section.id} className="bg-card rounded-lg municipal-shadow border">
            <AccordionTrigger className="px-6 text-base font-semibold hover:no-underline">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] text-right">דרישה</TableHead>
                    <TableHead className="text-right">פירוט</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium align-top">{row.requirement}</TableCell>
                      <TableCell className="text-muted-foreground">{row.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
