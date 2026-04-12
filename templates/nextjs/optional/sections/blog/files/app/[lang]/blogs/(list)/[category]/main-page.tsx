"use client";
import BlogComponent from "@/components/blogs/blog-component";
import type { Blog, BlogCategory } from "@/lib/blog-api";

export default function MainPage({
  category,
  categories,
  blogs,
}: {
  category: string;
  categories: BlogCategory[];
  blogs: Blog[];
}) {
  return <BlogComponent category={category} categories={categories} blogs={blogs} />;
}
