import { getBlogPosts } from "@/lib/blog-api";
import { BlogSectionView } from "./blog-section-view";

// Server component — fetches posts at render time (SSR/SSG)
export default async function BlogSection() {
  const posts = await getBlogPosts();

  return (
    <section id="blog" className="py-24">
      <div className="content-container">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold text-primary">From the blog</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Insights, tutorials, and updates from our team.
          </p>
        </div>
        <BlogSectionView posts={posts} />
      </div>
    </section>
  );
}
