import Navbar from "@/components/navs/navbar";
import FooterSection from "@/components/sections/footer-section";
import LayoutBlogs from "@/components/navs/layout-blogs";
import { getBlogCategories } from "@/lib/blog-api";

// ISR: revalidate every 60s — only visited pages regenerate, unvisited stay cached
// For instant updates on admin publish, use on-demand revalidation: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath
// To disable ISR and always fetch fresh: replace with `export const dynamic = "force-dynamic"`
export const revalidate = 60;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // params.lang available for future i18n label lookup
  await params;

  const categories = await getBlogCategories();

  return (
    <>
      <Navbar />
      <LayoutBlogs categories={categories}>{children}</LayoutBlogs>
      <FooterSection />
    </>
  );
}
