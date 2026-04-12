"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Blog, BlogCategory } from "@/lib/blog-api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function CategoryBadges({ categoryIds, categories }: { categoryIds?: string[]; categories: BlogCategory[] }) {
  if (!categoryIds?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {categoryIds.map((id) => (
        <Button key={id} className="h-[22px] w-fit rounded-[4px] bg-primary px-2 text-xs leading-[18px] tracking-[-0.24px] text-primary-foreground hover:bg-primary/80">
          {categories.find((c) => c.id === id)?.name ?? id}
        </Button>
      ))}
    </div>
  );
}

function Thumbnail({ src, alt, className }: { src?: string; alt?: string; className: string }) {
  return src ? (
    <img src={src} className={`h-full w-full object-cover ${className}`} alt={alt ?? ""} loading="lazy" />
  ) : (
    <div className={`h-full w-full bg-muted ${className}`} />
  );
}

// Desktop: featured left + 3 secondary right + optional related grid
function BlogViewDesktop({ blogs, categories }: { blogs: Blog[]; categories: BlogCategory[] }) {
  if (!blogs.length) return null;
  const [featured, ...rest] = blogs;
  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-[128px] pb-20"
    >
      <div className="flex justify-between gap-[29px] max-lg:gap-5">
        {/* Featured blog */}
        <div className={`flex flex-col gap-2 ${rest.length === 0 ? "w-full" : "w-1/2"}`}>
          <Link href={`/blogs/detail/${featured.slug}`} className={`w-full ${rest.length === 0 ? "h-[500px]" : "h-[320px]"}`}>
            <Thumbnail src={featured.thumbnail} className="rounded-[16px]" />
          </Link>
          <div className="mt-1">
            <CategoryBadges categoryIds={featured.categoryIds} categories={categories} />
          </div>
          <Link href={`/blogs/detail/${featured.slug}`} className="line-clamp-2 text-xl font-semibold leading-[24px] text-primary hover:underline">
            {featured.name}
          </Link>
          <time dateTime={featured.publishedAt} className="text-sm leading-5 text-primary">
            {formatDate(featured.publishedAt)}
          </time>
          <span className="mt-2 text-sm leading-5 text-primary">{featured.description}</span>
        </div>

        {/* Secondary blogs */}
        {rest.length > 0 && (
          <div className="flex w-1/2 flex-col gap-[30px]">
            {rest.slice(0, 3).map((blog) => (
              <Link key={blog.slug} href={`/blogs/detail/${blog.slug}`} className="flex gap-[30px] max-xl:gap-6 max-lg:gap-4">
                <div className="h-[147px] w-[191px] flex-shrink-0 max-lg:h-[130px] max-lg:w-[169px]">
                  <Thumbnail src={blog.thumbnail} className="rounded-[10px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <CategoryBadges categoryIds={blog.categoryIds} categories={categories} />
                  <span className="text-xl font-semibold leading-[30px] text-primary hover:underline max-xl:text-lg max-lg:text-base">
                    {blog.name}
                  </span>
                  <time dateTime={blog.publishedAt} className="text-sm leading-5 text-primary">
                    {formatDate(blog.publishedAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related: 4-col grid for blogs beyond index 4 */}
      {blogs.length > 4 && (
        <div className="flex flex-col gap-[32px]">
          <span className="text-2xl font-semibold leading-8 text-primary">Related blogs</span>
          <div className="grid grid-cols-4 gap-8">
            {blogs.slice(4).map((blog) => (
              <Link key={blog.slug} href={`/blogs/detail/${blog.slug}`} className="flex flex-col gap-[30px]">
                <div className="h-[220px] w-full max-lg:h-[130px]">
                  <Thumbnail src={blog.thumbnail} alt={blog.name} className="rounded-[16px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <CategoryBadges categoryIds={blog.categoryIds} categories={categories} />
                  <span className="text-xl font-semibold leading-[30px] text-primary max-xl:text-lg max-lg:text-base">
                    {blog.name}
                  </span>
                  <time dateTime={blog.publishedAt} className="text-sm leading-5 text-primary">
                    {formatDate(blog.publishedAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Mobile: full-width featured + list of remaining
function BlogViewMobile({ blogs, categories }: { blogs: Blog[]; categories: BlogCategory[] }) {
  if (!blogs.length) return null;
  const [featured, ...rest] = blogs;
  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-6 pb-20"
    >
      <div className="flex flex-col gap-2">
        <Link href={`/blogs/detail/${featured.slug}`} className="h-[230px] w-full">
          <Thumbnail src={featured.thumbnail} className="rounded-[16px]" />
        </Link>
        <div className="mt-1">
          <CategoryBadges categoryIds={featured.categoryIds} categories={categories} />
        </div>
        <Link href={`/blogs/detail/${featured.slug}`} className="text-xl font-semibold leading-[30px] text-primary hover:underline max-lg:text-lg">
          {featured.name}
        </Link>
        <time dateTime={featured.publishedAt} className="text-sm leading-5 text-primary">
          {formatDate(featured.publishedAt)}
        </time>
        <span className="mt-2 text-sm leading-5 text-primary">{featured.description}</span>
      </div>
      <div className="flex flex-col gap-6">
        {rest.map((blog) => (
          <Link key={blog.slug} href={`/blogs/detail/${blog.slug}`} className="flex items-start gap-4">
            <div className="h-[91px] w-[118px] flex-shrink-0">
              <Thumbnail src={blog.thumbnail} className="rounded-[10px]" />
            </div>
            <div className="flex flex-col gap-2">
              <CategoryBadges categoryIds={blog.categoryIds} categories={categories} />
              <span className="text-sm font-semibold leading-6 text-primary">{blog.name}</span>
              <time dateTime={blog.publishedAt} className="text-sm leading-5 text-primary">
                {formatDate(blog.publishedAt)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export function BlogSectionView({ blogs, categories = [] }: { blogs: Blog[]; categories?: BlogCategory[] }) {
  return (
    <>
      <div className="hidden md:block">
        <BlogViewDesktop blogs={blogs} categories={categories} />
      </div>
      <div className="block md:hidden">
        <BlogViewMobile blogs={blogs} categories={categories} />
      </div>
    </>
  );
}
