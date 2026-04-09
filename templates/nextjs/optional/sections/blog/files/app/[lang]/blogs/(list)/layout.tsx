import Navbar from "@/components/navs/navbar";
import FooterSection from "@/components/sections/footer-section";
import LayoutBlogs from "@/components/navs/layout-blogs";
import { getBlogCategories } from "@/lib/blog-api";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // params.lang available for future i18n label lookup
  await params;

  const rawCategories = await getBlogCategories();
  const categories = rawCategories.map((c) => ({ slug: c.toLowerCase(), name: c }));

  return (
    <>
      <Navbar />
      <LayoutBlogs categories={categories}>{children}</LayoutBlogs>
      <FooterSection />
    </>
  );
}
