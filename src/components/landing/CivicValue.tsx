export default function CivicValue() {
  return (
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 py-14 md:py-18 max-w-2xl text-center">
        <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight mb-3">
          לא רק כלי ניהול — פלטפורמה אזרחית הוגנת
        </h2>
        <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.8] max-w-lg mx-auto">
          המערכת תוכננה לאזן בין צרכי העיר, בעלי העסקים והתושבים, וליצור תהליך
          ברור, מכבד ונגיש לכל צד.
        </p>
        {/* Subtle gold accent */}
        <div className="flex justify-center mt-5">
          <div className="h-[2px] w-8 rounded-full" style={{ background: "hsl(39 75% 55% / 0.35)" }} />
        </div>
      </div>
    </section>
  );
}
