import Navbar from "@/components/navs/navbar";
import FooterSection from "@/components/sections/footer-section";
import LayoutBlogs from "@/components/navs/layout-blogs";
import { getBlogCategories } from "@/lib/blog-api";

// Nav categories are static data — cache window tunable via NEXT_BLOG_REVALIDATE_SECONDS
export const revalidate = Number(process.env.NEXT_BLOG_REVALIDATE_SECONDS) || 86400;

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
