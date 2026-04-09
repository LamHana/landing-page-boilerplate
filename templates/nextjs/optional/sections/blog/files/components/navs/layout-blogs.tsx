"use client";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Category = { slug: string; name: string };

export default function LayoutBlogs({
  categories,
  children,
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();

  // Extract current category from URL — last path segment after /blogs/
  const currentCategory = pathName.split("/blogs/")[1]?.split("/")[0] ?? "all";

  const handleTabChange = (category: string) => {
    // Replace only the category segment, preserving the rest of the path (e.g. /en/blogs/all)
    const base = pathName.substring(0, pathName.lastIndexOf("/blogs/"));
    router.push(`${base}/blogs/${category}`);
  };

  return (
    <div className="py-20 px-5">
      <div className="mx-auto max-w-[1200px]">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-primary">Blog</h1>
          <p className="text-lg text-muted-foreground">Insights, tutorials, and updates from our team.</p>
        </div>

        {/* Category tabs */}
        <Tabs value={currentCategory} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.slug} value={cat.slug}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
}
