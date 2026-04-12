import { getBlogCategories, getBlogsByCategory } from "@/lib/blog-api";
import { createMetadata } from "@/lib/metadata";
import { cache } from "react";
import MainPage from "./main-page";

// Cache listing pages for 24h — adjust this value to tune staleness
export const revalidate = 86400;

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
  const [categories, blogs] = await Promise.all([
    getCategories(),
    getBlogsByCategory({ category, pageSize: 9999 }),
  ]);
  return <MainPage category={category} categories={categories} blogs={blogs} />;
}
