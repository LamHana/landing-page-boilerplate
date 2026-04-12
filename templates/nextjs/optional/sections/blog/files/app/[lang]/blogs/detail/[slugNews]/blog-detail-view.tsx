"use client";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Blog, BlogCategory } from "@/lib/blog-api";
import { sanitizeBlogContent } from "@/lib/sanitize";
import "@/styles/prose.css";

function CategoryBadges({ categoryIds, categories = [] }: { categoryIds?: string[]; categories?: BlogCategory[] }) {
  if (!categoryIds?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {categoryIds.map((id) => {
        const name = categories.find((c) => c.id === id)?.name ?? id;
        return (
          <Button key={id} className="h-[22px] w-fit rounded-[4px] bg-primary text-xs text-primary-foreground hover:bg-primary/80">
            {name}
          </Button>
        );
      })}
    </div>
  );
}

// Sidebar: related blogs in the same category
function RelatedBlogs({ blogs, dateFormatter, categories }: { blogs: Blog[]; dateFormatter: Intl.DateTimeFormat; categories: BlogCategory[] }) {
  if (!blogs.length) return null;

  return (
    <aside className="mt-40 col-span-4 flex flex-col gap-4 max-xl:col-span-1 max-xl:mt-0">
      <h3 className="text-2xl font-semibold text-primary">Related Blogs</h3>
      <div className="flex flex-col gap-6">
        {blogs.slice(0, 5).map((blog) => (
          <Link
            key={blog.slug}
            href={`/blogs/detail/${blog.slug}`}
            className="flex items-start gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="h-[91px] w-[118px] flex-shrink-0">
              {blog.thumbnail ? (
                <img
                  src={blog.thumbnail}
                  alt={blog.name}
                  loading="lazy"
                  className="h-full w-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="h-full w-full bg-muted rounded-[10px]" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <CategoryBadges categoryIds={blog.categoryIds} categories={categories} />
              <span className="text-sm font-semibold leading-6 text-primary line-clamp-2">
                {blog.name}
              </span>
              <time dateTime={blog.publishedAt} className="text-sm text-muted-foreground">
                {dateFormatter.format(new Date(blog.publishedAt))}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

type BlogDetailViewProps = {
  blog: Blog;
  relatedBlogs: Blog[];
  categories: BlogCategory[];
  lang: string;
};

export function BlogDetailView({ blog, relatedBlogs, categories, lang }: BlogDetailViewProps) {
  // Locale-aware date formatter — useMemo avoids recreation on every render
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(lang === "en" ? "en-US" : "vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }),
    [lang]
  );

  const htmlContent = typeof blog.content === "string"
    ? blog.content
    : blog.content?.htmlContent ?? "";

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="py-20 grid grid-cols-12 gap-8 max-xl:grid-cols-1 max-md:mt-9"
    >
      {/* Main content */}
      <article className="col-span-8 max-xl:col-span-1 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <CategoryBadges categoryIds={blog.categoryIds} categories={categories} />
          <h1 className="text-3xl font-semibold leading-tight text-primary">{blog.name}</h1>
          <time dateTime={blog.publishedAt} className="text-sm text-muted-foreground">
            {dateFormatter.format(new Date(blog.publishedAt))}
          </time>
          <div className="rounded-[4px] bg-muted p-4">
            <p className="text-sm leading-5 text-primary">{blog.description}</p>
          </div>
        </div>
        {blog.thumbnail && (
          <img src={blog.thumbnail} alt={blog.name} className="w-full rounded-2xl object-cover max-h-[420px]" />
        )}
        {htmlContent && (
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(htmlContent) }}
          />
        )}
      </article>

      <RelatedBlogs blogs={relatedBlogs} dateFormatter={dateFormatter} categories={categories} />
    </motion.div>
  );
}
