import { getBlogCategories, getBlogsByCategory } from "@/lib/blog-api";
import { createMetadata } from "@/lib/metadata";
import { cache } from "react";
import MainPage from "./main-page";

// Cache listing pages — same window as detail pages, tune via NEXT_BLOG_REVALIDATE_SECONDS
export const revalidate = Number(process.env.NEXT_BLOG_REVALIDATE_SECONDS) || 86400;

const getCategories = cache(getBlogCategories);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}) {
  const { category } = await params;
  const categories = await getCategories();
  const matched = categories.find((c) => c.slug === category);

  return createMetadata({
    title: matched ? `Blog | ${matched.name}` : "Blog",
    description: "Insights, tutorials, and updates from our team.",
    path: `/blogs/${category}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}) {
  const { category } = await params;
  const [categories, { blogs }] = await Promise.all([
    getCategories(),
    getBlogsByCategory({ category, pageSize: 9999 }),
  ]);
  return <MainPage category={category} categories={categories} blogs={blogs} />;
}
