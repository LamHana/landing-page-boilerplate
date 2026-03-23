"use client";
import Link from "next/link";
import { motion } from "motion/react";

// Replace with your actual blog posts or fetch from CMS/API
const BLOG_POSTS = [
  {
    slug: "getting-started",
    title: "Getting started with our platform",
    excerpt: "Learn how to set up your account and launch your first project in minutes.",
    date: "2024-01-15",
    readTime: "3 min read",
  },
  {
    slug: "best-practices",
    title: "Best practices for modern web apps",
    excerpt: "A guide to building scalable, maintainable applications with the latest tools.",
    date: "2024-02-01",
    readTime: "5 min read",
  },
  {
    slug: "case-study",
    title: "How we scaled to 10k users",
    excerpt: "A behind-the-scenes look at the challenges and solutions along the way.",
    date: "2024-02-20",
    readTime: "7 min read",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-24">
      <div className="content-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold">From the blog</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Insights, tutorials, and updates from our team.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group space-y-4 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="h-40 rounded-xl bg-accent" />
                <div className="space-y-2">
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                </div>
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary hover:underline">
                  Read more →
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
