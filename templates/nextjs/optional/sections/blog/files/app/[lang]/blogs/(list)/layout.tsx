import Navbar from "@/components/navs/navbar";
import FooterSection from "@/components/sections/footer-section";
import LayoutBlogs from "@/components/navs/layout-blogs";
import { getBlogCategories } from "@/lib/blog-api";

// Nav categories are static data — cache for 24h
export const revalidate = 86400;

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
