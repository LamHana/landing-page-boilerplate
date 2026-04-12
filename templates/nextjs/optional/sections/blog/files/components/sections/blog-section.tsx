import Link from "next/link";
import { getBlogs, getBlogCategories } from "@/lib/blog-api";
import { BlogSectionView } from "./blog-section-view";

// Server component — fetches latest 4 blogs at render time (SSR/SSG)
export default async function BlogSection() {
  const [blogs, categories] = await Promise.all([getBlogs(4), getBlogCategories()]);

  return (
    <section id="blog" className="py-24">
      <div className="content-container">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold text-primary">From the blog</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Insights, tutorials, and updates from our team.
          </p>
        </div>
        <BlogSectionView blogs={blogs} categories={categories} />
        <div className="mt-10 text-center">
          <Link
            href="/blogs/all"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View all blogs →
          </Link>
        </div>
      </div>
    </section>
  );
}
