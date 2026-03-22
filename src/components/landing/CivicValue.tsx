export default function CivicValue() {
  return (
    <section className="bg-card border-y border-border/60">
      <div className="container mx-auto px-4 py-16 md:py-20 max-w-2xl text-center">
        <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight mb-4">
          לא רק כלי ניהול — פלטפורמה אזרחית הוגנת
        </h2>
        <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.85] max-w-lg mx-auto">
          המערכת תוכננה לאזן בין צרכי העיר, בעלי העסקים והתושבים, וליצור תהליך
          ברור, מכבד ונגיש לכל צד.
        </p>
        {/* Subtle gold accent */}
        <div className="flex justify-center mt-6">
          <div className="h-[2px] w-10 rounded-full" style={{ background: "hsl(39 75% 55% / 0.3)" }} />
        </div>
      </div>
    </section>
  );
}
