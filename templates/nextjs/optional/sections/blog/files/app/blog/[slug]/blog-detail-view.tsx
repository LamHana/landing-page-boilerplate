"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-api";
import { sanitizeBlogContent } from "@/lib/sanitize";
import "@/styles/prose.css";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
}

// Sidebar: related posts in the same category
function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <aside className="mt-40 col-span-4 flex flex-col gap-4 max-xl:col-span-1 max-xl:mt-0">
      <h3 className="text-2xl font-semibold text-primary">Related Posts</h3>
      <div className="flex flex-col gap-6">
        {posts.slice(0, 5).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-start gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="h-[91px] w-[118px] flex-shrink-0">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="h-full w-full bg-muted rounded-[10px]" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Button className="h-[22px] w-fit rounded-[4px] bg-primary text-xs text-primary-foreground hover:bg-primary/80">
                {post.category}
              </Button>
              <span className="text-sm font-semibold leading-6 text-primary line-clamp-2">
                {post.title}
              </span>
              <time dateTime={post.date} className="text-sm text-muted-foreground">
                {formatDate(post.date)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

type BlogDetailViewProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

// Client component — handles animations and HTML content rendering
export function BlogDetailView({ post, relatedPosts }: BlogDetailViewProps) {
  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="py-12 grid grid-cols-12 gap-8 max-xl:grid-cols-1 max-md:mt-9"
    >
      {/* Main content */}
      <article className="col-span-8 max-xl:col-span-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <Button className="h-[22px] w-fit rounded-[4px] bg-primary text-xs text-primary-foreground hover:bg-primary/80">
            {post.category}
          </Button>
          <h1 className="text-3xl font-semibold leading-tight text-primary">
            {post.title}
          </h1>
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
          {/* Description callout */}
          <div className="rounded-[4px] bg-muted p-4">
            <p className="text-sm leading-5 text-primary">{post.description}</p>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full rounded-2xl object-cover max-h-[420px]"
          />
        )}

        {/* Body — sanitized HTML */}
        {post.content && (
          <div
            className="prose prose-sm max-w-none text-primary"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(post.content) }}
          />
        )}
      </article>

      {/* Sidebar */}
      <RelatedPosts posts={relatedPosts} />
    </motion.div>
  );
}
