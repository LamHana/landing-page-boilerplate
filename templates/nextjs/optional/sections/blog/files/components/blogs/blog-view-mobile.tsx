"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB");
}

export function BlogViewMobile({ data }: { data: BlogPost[] }) {
  const [featured, ...rest] = data;

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-6 pb-20"
    >
      {/* Featured Post */}
      <div className="flex flex-col gap-2">
        <Link href={`/blogs/detail/${featured.slug}`} className="h-[230px] w-full">
          {featured.thumbnail ? (
            <img
              src={featured.thumbnail}
              alt={featured.title}
              loading="eager"
              className="h-full w-full object-cover rounded-[16px]"
            />
          ) : (
            <div className="h-full w-full bg-muted rounded-[16px]" />
          )}
        </Link>
        <Button className="h-[22px] w-fit rounded-[4px] bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/80">
          {featured.category}
        </Button>
        <Link
          href={`/blogs/detail/${featured.slug}`}
          className="text-xl font-semibold leading-[30px] text-primary hover:underline"
        >
          {featured.title}
        </Link>
        <time dateTime={featured.date} className="text-sm text-primary">
          {formatDate(featured.date)}
        </time>
        <span className="text-sm text-primary">{featured.description}</span>
      </div>

      {/* Rest of posts */}
      <div className="flex flex-col gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blogs/detail/${post.slug}`} className="flex items-start gap-4">
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
            <div className="flex flex-col gap-2">
              <Button className="h-[22px] w-fit rounded-[4px] bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/80">
                {post.category}
              </Button>
              <span className="text-sm font-semibold text-primary hover:underline">{post.title}</span>
              <time dateTime={post.date} className="text-xs text-primary">
                {formatDate(post.date)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
