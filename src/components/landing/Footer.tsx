export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground/50">
          © {new Date().getFullYear()} עיריית אשדוד · מנהל הנדסה ותכנון עירוני
        </p>
        <p className="text-[10px] text-muted-foreground/35">
          מערכת ניהול עמדות מזון במרחב הציבורי
        </p>
      </div>
    </footer>
  );
}
