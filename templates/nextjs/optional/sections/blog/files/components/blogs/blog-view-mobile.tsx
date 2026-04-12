"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Blog, BlogCategory } from "@/lib/blog-api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB");
}

function CategoryBadges({ categoryIds, categories }: { categoryIds?: string[]; categories: BlogCategory[] }) {
  if (!categoryIds?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {categoryIds.map((id) => (
        <Button key={id} className="h-[22px] w-fit rounded-[4px] bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/80">
          {categories.find((c) => c.id === id)?.name ?? id}
        </Button>
      ))}
    </div>
  );
}

export function BlogViewMobile({ data, categories = [] }: { data: Blog[]; categories?: BlogCategory[] }) {
  const [featured, ...rest] = data;

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-6 pb-20"
    >
      {/* Featured Blog */}
      <div className="flex flex-col gap-2">
        <Link href={`/blogs/detail/${featured.slug}`} className="h-[230px] w-full">
          {featured.thumbnail ? (
            <img
              src={featured.thumbnail}
              alt={featured.name}
              loading="eager"
              className="h-full w-full object-cover rounded-[16px]"
            />
          ) : (
            <div className="h-full w-full bg-muted rounded-[16px]" />
          )}
        </Link>
        <CategoryBadges categoryIds={featured.categoryIds} categories={categories} />
        <Link
          href={`/blogs/detail/${featured.slug}`}
          className="text-xl font-semibold leading-[30px] text-primary hover:underline"
        >
          {featured.name}
        </Link>
        <time dateTime={featured.publishedAt} className="text-sm text-primary">
          {formatDate(featured.publishedAt)}
        </time>
        <span className="text-sm text-primary">{featured.description}</span>
      </div>

      {/* Rest of blogs */}
      <div className="flex flex-col gap-6">
        {rest.map((blog) => (
          <Link key={blog.slug} href={`/blogs/detail/${blog.slug}`} className="flex items-start gap-4">
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
            <div className="flex flex-col gap-2">
              <CategoryBadges categoryIds={blog.categoryIds} categories={categories} />
              <span className="text-sm font-semibold text-primary hover:underline">{blog.name}</span>
              <time dateTime={blog.publishedAt} className="text-xs text-primary">
                {formatDate(blog.publishedAt)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
