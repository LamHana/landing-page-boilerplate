"use client";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Blog, BlogCategory } from "@/lib/blog-api";
import BlogViewDesktop from "./blog-view-desktop";
import { BlogViewMobile } from "./blog-view-mobile";

async function fetchBlogs(category: string): Promise<Blog[]> {
  const params = new URLSearchParams({ category, pageSize: "9999" });
  const res = await fetch(`/api/blogs?${params}`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const data = await res.json();
  return data.blogs;
}

export default function BlogComponent({
  category,
  categories = [],
  blogs: initialBlogs,
}: {
  category: string;
  categories?: BlogCategory[];
  blogs?: Blog[];
}) {
  const isMobile = useIsMobile();

  const { data, isError, isPending } = useQuery<Blog[]>({
    queryKey: ["/blogs/list-all", { category }],
    queryFn: () => fetchBlogs(category),
    initialData: initialBlogs,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="h-[200px] w-full rounded-xl bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-center text-muted-foreground">
        Failed to load blogs. Please try again.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-center text-2xl font-bold text-primary">
        No blogs yet
      </div>
    );
  }

  return isMobile ? <BlogViewMobile data={data} categories={categories} /> : <BlogViewDesktop data={data} categories={categories} />;
}
