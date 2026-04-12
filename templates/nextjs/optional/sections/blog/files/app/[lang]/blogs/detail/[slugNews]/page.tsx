import { notFound } from "next/navigation";
import { cache } from "react";
import { getBlogBySlug, getRelatedBlogs, getBlogCategories, getBlogs } from "@/lib/blog-api";
import { createMetadata } from "@/lib/metadata";
import { BlogDetailView } from "./blog-detail-view";
import Navbar from "@/components/navs/navbar";
import FooterSection from "@/components/sections/footer-section";

// Cache this page's HTML — serve stale + regenerate in background after expiry
export const revalidate = Number(process.env.NEXT_BLOG_REVALIDATE_SECONDS) || 86400;

// Pre-render top 20 blog detail pages at build time; remaining slugs render on first visit then get cached
export async function generateStaticParams() {
  try {
    const blogs = await getBlogs(20);
    return blogs.map((blog) => ({ slugNews: blog.slug }));
  } catch {
    return []; // build succeeds even if API is down
  }
}

// Deduplicate API calls shared between generateMetadata and Page
const fetchBlog = cache(getBlogBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugNews: string; lang: string }>;
}) {
  const { slugNews } = await params;
  const blog = await fetchBlog(slugNews);

  if (!blog) {
    return createMetadata({ title: "Blog", description: "Blog" });
  }

  return createMetadata({
    title: blog.name,
    description: blog.description,
    image: blog.thumbnail,
    path: `/blogs/detail/${blog.slug}`,
  });
}

// RSC: fetch blog + related, guard, pass as plain props to client component
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slugNews: string; lang: string }>;
}) {
  const { slugNews, lang } = await params;

  const blog = await fetchBlog(slugNews);

  // Guard — must happen server-side before anything renders
  if (!blog) notFound();

  // Parallel: categories + related (related needs blog.categoryIds[0] from above)
  const [categories, relatedBlogs] = await Promise.all([
    getBlogCategories(),
    getRelatedBlogs(blog.categoryIds?.[0] ?? "", blog.id ?? ""),
  ]);

  return (
    <>
      <Navbar />
      <main className="content-container">
        <BlogDetailView blog={blog} relatedBlogs={relatedBlogs} categories={categories} lang={lang} />
      </main>
      <FooterSection />
    </>
  );
}
