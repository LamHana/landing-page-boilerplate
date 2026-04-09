import { notFound } from "next/navigation";
import { cache } from "react";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-api";
import { createMetadata } from "@/lib/metadata";
import { BlogDetailView } from "./blog-detail-view";
import Navbar from "@/components/navs/navbar";
import FooterSection from "@/components/sections/footer-section";

// Deduplicate fetches within a single render
const fetchPost = cache(getBlogPostBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return createMetadata({ title: "Blog", description: "Blog post" });
  }

  return createMetadata({
    title: post.title,
    description: post.description,
    image: post.thumbnail,
    path: `/blogs/detail/${post.slug}`,
  });
}

// Server component — fetches post + related posts, then passes to client view
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  return (
    <>
      <Navbar />
      <main className="content-container">
        <BlogDetailView post={post} relatedPosts={relatedPosts} />
      </main>
      <FooterSection />
    </>
  );
}
