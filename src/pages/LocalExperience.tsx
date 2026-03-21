import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ExperiencePost {
  id: string;
  imageUrl: string | null;
  text: string;
  dbId?: string; // id from database if already saved
}

function createPost(): ExperiencePost {
  return { id: crypto.randomUUID(), imageUrl: null, text: "" };
}

export default function LocalExperience() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ExperiencePost[]>([createPost()]);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Load existing posts for the logged-in user
  useEffect(() => {
    if (!user) return;
    setLoadingExisting(true);
    supabase
      .from("experience_posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else if (data && data.length > 0) {
          setPosts(
            data.map((row) => ({
              id: crypto.randomUUID(),
              imageUrl: row.image_url,
              text: row.text_content || "",
              dbId: row.id,
            }))
          );
        }
        setLoadingExisting(false);
      });
  }, [user]);

  const updatePost = useCallback((id: string, patch: Partial<ExperiencePost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removePost = useCallback((id: string) => {
    setPosts((prev) => {
      const post = prev.find((p) => p.id === id);
      // If it was saved in DB, delete it
      if (post?.dbId) {
        supabase.from("experience_posts").delete().eq("id", post.dbId).then(({ error }) => {
          if (error) console.error(error);
        });
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const addPost = () => setPosts((prev) => [...prev, createPost()]);

  const handleSave = async () => {
    console.log("[ExperienceSave] user:", user?.id, "posts:", posts.length);
    if (!user) {
      toast.error("יש להתחבר כדי לשמור חוויות");
      return;
    }

    const validPosts = posts.filter((p) => p.text.trim() || p.imageUrl);
    console.log("[ExperienceSave] validPosts:", validPosts.length, validPosts.map(p => ({ text: p.text?.substring(0, 20), hasImage: !!p.imageUrl })));
    if (validPosts.length === 0) {
      toast.error("אין תוכן לשמירה");
      return;
    }

    setSaving(true);

    try {
      for (const post of validPosts) {
        if (post.dbId) {
          // Update existing
          const { error } = await supabase
            .from("experience_posts")
            .update({
              image_url: post.imageUrl,
              text_content: post.text,
            })
            .eq("id", post.dbId);
          if (error) throw error;
        } else {
          // Insert new
          const { data, error } = await supabase
            .from("experience_posts")
            .insert({
              user_id: user.id,
              image_url: post.imageUrl,
              text_content: post.text,
            })
            .select("id")
            .single();
          if (error) throw error;
          // Store the DB id
          updatePost(post.id, { dbId: data.id });
        }
      }
      toast.success("החוויות נשמרו בהצלחה!");
    } catch (err: any) {
      console.error(err);
      toast.error("שגיאה בשמירה: " + (err.message || "נסו שוב"));
    } finally {
      setSaving(false);
    }
  };

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
        {loadingExisting ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {posts.map((post) => (
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

            {/* Save button */}
            <div className="flex justify-center pt-4 pb-8">
              <Button
                size="lg"
                onClick={handleSave}
                disabled={saving}
                className="gap-2 min-w-[200px]"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {saving ? "שומר..." : "שמור חוויות"}
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
