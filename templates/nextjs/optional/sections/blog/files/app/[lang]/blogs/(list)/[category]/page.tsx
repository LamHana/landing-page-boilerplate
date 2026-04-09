import { getBlogCategories } from "@/lib/blog-api";
import { createMetadata } from "@/lib/metadata";
import { cache } from "react";
import MainPage from "./main-page";

const getCategories = cache(getBlogCategories);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}) {
  const { category } = await params;
  const categories = await getCategories();
  const matched = categories.find((c) => c.toLowerCase() === category);

  return createMetadata({
    title: matched ? `Blog | ${matched}` : "Blog",
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
  return <MainPage category={category} />;
}
