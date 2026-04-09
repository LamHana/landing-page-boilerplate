"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB");
}

function Thumbnail({ src, alt, className }: { src?: string; alt?: string; className: string }) {
  return src ? (
    <img src={src} alt={alt ?? ""} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`h-full w-full bg-muted ${className}`} />
  );
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <Button className="h-[22px] w-fit rounded-[4px] bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/80">
      {label}
    </Button>
  );
}

export default function BlogViewDesktop({ data }: { data: BlogPost[] }) {
  const [featured, ...rest] = data;

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-[128px] pb-20"
    >
      {/* Featured + Sidebar */}
      <div className="flex justify-between gap-[29px] max-lg:gap-5">
        {/* Featured Post (Left) */}
        <div className={`flex flex-col gap-2 ${data.length <= 1 ? "w-full" : "w-1/2"}`}>
          <Link
            href={`/blogs/detail/${featured.slug}`}
            className={`w-full ${data.length <= 1 ? "h-[500px]" : "h-[320px]"}`}
          >
            <Thumbnail src={featured.thumbnail} alt={featured.title} className="rounded-[16px]" />
          </Link>
          <div className="mt-1">
            <CategoryBadge label={featured.category} />
          </div>
          <Link
            href={`/blogs/detail/${featured.slug}`}
            className="line-clamp-2 text-xl font-semibold leading-[24px] text-primary hover:underline"
          >
            {featured.title}
          </Link>
          <time dateTime={featured.date} className="text-sm leading-5 text-primary">
            {formatDate(featured.date)}
          </time>
          <span className="mt-2 text-sm leading-5 text-primary">{featured.description}</span>
        </div>

        {/* Sidebar (Right) — next 3 posts */}
        {rest.length > 0 && (
          <div className="flex w-1/2 flex-col gap-[30px]">
            {rest.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/detail/${post.slug}`}
                className="flex gap-[30px] max-xl:gap-6 max-lg:gap-4"
              >
                <div className="h-[147px] w-[191px] flex-shrink-0 max-lg:h-[130px] max-lg:w-[169px]">
                  <Thumbnail src={post.thumbnail} alt={post.title} className="rounded-[10px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <CategoryBadge label={post.category} />
                  <span className="line-clamp-3 text-xl font-semibold leading-[30px] text-primary hover:underline max-xl:text-lg max-lg:text-base">
                    {post.title}
                  </span>
                  <time dateTime={post.date} className="text-sm leading-5 text-primary">
                    {formatDate(post.date)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Grid — posts beyond index 4 */}
      {data.length > 4 && (
        <div className="flex flex-col gap-[32px]">
          <span className="text-2xl font-semibold leading-8 text-primary">More Posts</span>
          <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2">
            {data.slice(4).map((post) => (
              <Link key={post.slug} href={`/blogs/detail/${post.slug}`} className="flex flex-col gap-[30px]">
                <div className="h-[220px] w-full max-lg:h-[160px]">
                  <Thumbnail src={post.thumbnail} alt={post.title} className="rounded-[16px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <CategoryBadge label={post.category} />
                  <span className="line-clamp-2 text-xl font-semibold leading-[30px] text-primary max-xl:text-lg max-lg:text-base">
                    {post.title}
                  </span>
                  <time dateTime={post.date} className="text-sm leading-5 text-primary">
                    {formatDate(post.date)}
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
