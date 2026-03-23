"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  thumbnail?: string;
};

// Replace with your CMS/API data
const BLOG_POSTS: BlogPost[] = [
  { slug: "post-1", title: "Getting started with our platform", description: "Learn how to set up your account and launch your first project in minutes.", date: "2024-01-15", category: "Product" },
  { slug: "post-2", title: "Best practices for modern web apps", description: "A guide to building scalable, maintainable applications.", date: "2024-02-01", category: "Engineering" },
  { slug: "post-3", title: "How we scaled to 10k users", description: "A behind-the-scenes look at the challenges and solutions.", date: "2024-02-20", category: "Growth" },
  { slug: "post-4", title: "Designing for accessibility", description: "Why inclusive design benefits everyone and how to do it.", date: "2024-03-05", category: "Design" },
  { slug: "post-5", title: "Our open-source journey", description: "What we learned shipping our first open-source library.", date: "2024-03-18", category: "Engineering" },
  { slug: "post-6", title: "The future of edge computing", description: "How edge functions are changing how we think about latency.", date: "2024-04-01", category: "Product" },
  { slug: "post-7", title: "Team rituals that actually work", description: "Async-first habits that helped our remote team stay aligned.", date: "2024-04-10", category: "Culture" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <Button className="h-[22px] w-fit rounded-[4px] bg-primary text-xs leading-[18px] tracking-[-0.24px] text-primary-foreground hover:bg-primary/80">
      {label}
    </Button>
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
function BlogViewDesktop({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts;
  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-[128px] pb-20"
    >
      <div className="flex justify-between gap-[29px] max-lg:gap-5">
        {/* Featured post */}
        <div className={`flex flex-col gap-2 ${rest.length === 0 ? "w-full" : "w-1/2"}`}>
          <Link href={`/blog/${featured.slug}`} className={`w-full ${rest.length === 0 ? "h-[500px]" : "h-[320px]"}`}>
            <Thumbnail src={featured.thumbnail} className="rounded-[16px]" />
          </Link>
          <div className="mt-1">
            <CategoryBadge label={featured.category} />
          </div>
          <Link href={`/blog/${featured.slug}`} className="line-clamp-2 text-xl font-semibold leading-[24px] text-primary hover:underline">
            {featured.title}
          </Link>
          <time dateTime={featured.date} className="text-sm leading-5 text-primary">
            {formatDate(featured.date)}
          </time>
          <span className="mt-2 text-sm leading-5 text-primary">{featured.description}</span>
        </div>

        {/* Secondary posts */}
        {rest.length > 0 && (
          <div className="flex w-1/2 flex-col gap-[30px]">
            {rest.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-[30px] max-xl:gap-6 max-lg:gap-4">
                <div className="h-[147px] w-[191px] flex-shrink-0 max-lg:h-[130px] max-lg:w-[169px]">
                  <Thumbnail src={post.thumbnail} className="rounded-[10px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <CategoryBadge label={post.category} />
                  <span className="text-xl font-semibold leading-[30px] text-primary hover:underline max-xl:text-lg max-lg:text-base">
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

      {/* Related: 4-col grid for posts beyond index 4 */}
      {posts.length > 4 && (
        <div className="flex flex-col gap-[32px]">
          <span className="text-2xl font-semibold leading-8 text-primary">Related posts</span>
          <div className="grid grid-cols-4 gap-8">
            {posts.slice(4).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex flex-col gap-[30px]">
                <div className="h-[220px] w-full max-lg:h-[130px]">
                  <Thumbnail src={post.thumbnail} alt={post.title} className="rounded-[16px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <CategoryBadge label={post.category} />
                  <span className="text-xl font-semibold leading-[30px] text-primary max-xl:text-lg max-lg:text-base">
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

// Mobile: full-width featured + horizontal list of remaining
function BlogViewMobile({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts;
  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1 }}
      className="flex flex-col gap-6 pb-20"
    >
      <div className="flex flex-col gap-2">
        <Link href={`/blog/${featured.slug}`} className="h-[230px] w-full">
          <Thumbnail src={featured.thumbnail} className="rounded-[16px]" />
        </Link>
        <div className="mt-1">
          <CategoryBadge label={featured.category} />
        </div>
        <Link href={`/blog/${featured.slug}`} className="text-xl font-semibold leading-[30px] text-primary hover:underline max-lg:text-lg">
          {featured.title}
        </Link>
        <time dateTime={featured.date} className="text-sm leading-5 text-primary">
          {formatDate(featured.date)}
        </time>
        <span className="mt-2 text-sm leading-5 text-primary">{featured.description}</span>
      </div>
      <div className="flex flex-col gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-start gap-4">
            <div className="h-[91px] w-[118px] flex-shrink-0">
              <Thumbnail src={post.thumbnail} className="rounded-[10px]" />
            </div>
            <div className="flex flex-col gap-2">
              <CategoryBadge label={post.category} />
              <span className="text-sm font-semibold leading-6 text-primary">{post.title}</span>
              <time dateTime={post.date} className="text-sm leading-5 text-primary">
                {formatDate(post.date)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function BlogSection() {
  return (
    <section id="blog" className="py-24">
      <div className="content-container">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold text-primary">From the blog</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Insights, tutorials, and updates from our team.
          </p>
        </div>
        <div className="hidden md:block">
          <BlogViewDesktop posts={BLOG_POSTS} />
        </div>
        <div className="block md:hidden">
          <BlogViewMobile posts={BLOG_POSTS} />
        </div>
      </div>
    </section>
  );
}
