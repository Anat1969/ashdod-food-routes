import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import FileUpload from "@/components/FileUpload";

interface ExperiencePost {
  id: string;
  imageUrl: string | null;
  text: string;
}

function createPost(): ExperiencePost {
  return { id: crypto.randomUUID(), imageUrl: null, text: "" };
}

export default function LocalExperience() {
  const [posts, setPosts] = useState<ExperiencePost[]>([createPost()]);

  const updatePost = useCallback((id: string, patch: Partial<ExperiencePost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPost = () => setPosts((prev) => [...prev, createPost()]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero prompt */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            חוויה מקומית...
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
             style={{ fontFamily: "'David Libre', 'Frank Ruhl Libre', serif" }}>
            שתפו חוויות מהמפגש במקום — תמונה ומילים.<br />
            ספרו על הטעמים, האנשים, האווירה, הרגע.
          </p>
        </div>
      </section>

      {/* Posts list */}
      <section className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        {posts.map((post, idx) => (
          <article
            key={post.id}
            className="relative rounded-2xl border bg-card shadow-sm overflow-hidden"
          >
            {/* Remove button */}
            {posts.length > 1 && (
              <button
                onClick={() => removePost(post.id)}
                className="absolute top-3 left-3 z-10 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive transition-colors"
                aria-label="הסר פוסט"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="flex flex-col md:flex-row">
              {/* Image upload area */}
              <div className="md:w-[280px] shrink-0 p-4">
                <FileUpload
                  bucket="truck-photos"
                  storagePath={`experiences/${post.id}`}
                  currentUrl={post.imageUrl}
                  onUploaded={(url) => updatePost(post.id, { imageUrl: url })}
                  onDeleted={() => updatePost(post.id, { imageUrl: null })}
                  accept="image/*,video/*"
                  label="תמונה או סרטון קצר"
                  isImage={true}
                  className="h-full min-h-[200px]"
                />
              </div>

              {/* Text area */}
              <div className="flex-1 p-4 md:pr-0">
                <Textarea
                  value={post.text}
                  onChange={(e) => updatePost(post.id, { text: e.target.value })}
                  placeholder="ספרו על החוויה שלכם... הטעמים, האווירה, הרגע המיוחד"
                  className="w-full min-h-[200px] md:min-h-[260px] resize-y text-base md:text-lg leading-relaxed border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                  style={{ fontFamily: "'David Libre', 'Frank Ruhl Libre', serif" }}
                  dir="rtl"
                />
              </div>
            </div>
          </article>
        ))}

        {/* Add post button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={addPost}
            className="gap-2 rounded-full border-dashed border-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
            הוסיפו עוד חוויה
          </Button>
        </div>
      </section>
    </div>
  );
}
