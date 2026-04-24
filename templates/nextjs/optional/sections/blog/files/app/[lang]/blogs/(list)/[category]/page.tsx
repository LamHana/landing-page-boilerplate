import { getBlogCategories, getBlogsByCategory } from "@/lib/blog-api";
import { createMetadata } from "@/lib/metadata";
import { cache } from "react";
import MainPage from "./main-page";

// ISR: revalidate every 60s — only visited pages regenerate, unvisited stay cached
// For instant updates on admin publish, use on-demand revalidation: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath
// To disable ISR and always fetch fresh: replace with `export const dynamic = "force-dynamic"`
export const revalidate = 60;

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
