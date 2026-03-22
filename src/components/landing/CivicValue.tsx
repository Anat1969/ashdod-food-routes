export default function CivicValue() {
  return (
    <section className="border-y border-border/40" style={{
      background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(216 20% 97.5%) 100%)"
    }}>
      <div className="container mx-auto px-4 py-20 md:py-24 max-w-2xl text-center">
        <div className="flex justify-center mb-5">
          <div className="h-[2px] w-7 rounded-full bg-accent/50" />
        </div>
        <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight mb-5">
          לא רק כלי ניהול — פלטפורמה אזרחית הוגנת
        </h2>
        <p className="text-[13px] md:text-[14px] text-muted-foreground/75 leading-[1.9] max-w-lg mx-auto">
          המערכת תוכננה לאזן בין צרכי העיר, בעלי העסקים והתושבים, וליצור תהליך
          ברור, מכבד ונגיש לכל צד.
        </p>
      </div>
    </section>
  );
}
