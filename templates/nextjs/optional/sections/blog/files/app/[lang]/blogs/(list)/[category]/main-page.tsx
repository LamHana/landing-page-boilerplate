"use client";
import BlogComponent from "@/components/blogs/blog-component";

export default function MainPage({ category }: { category: string }) {
  return <BlogComponent category={category} />;
}
