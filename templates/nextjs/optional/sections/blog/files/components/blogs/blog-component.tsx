"use client";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BlogPost } from "@/lib/blog-api";
import BlogViewDesktop from "./blog-view-desktop";
import { BlogViewMobile } from "./blog-view-mobile";

async function fetchBlogPosts(category: string): Promise<BlogPost[]> {
  const params = new URLSearchParams({ category, pageSize: "9999" });
  const res = await fetch(`/api/blogs?${params}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return data.posts;
}

export default function BlogComponent({ category }: { category: string }) {
  const isMobile = useIsMobile();

  const { data, isError, isPending } = useQuery<BlogPost[]>({
    queryKey: ["/blogs/list-all", { category }],
    queryFn: () => fetchBlogPosts(category),
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
        Failed to load posts. Please try again.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-center text-2xl font-bold text-primary">
        No posts yet
      </div>
    );
  }

  return isMobile ? <BlogViewMobile data={data} /> : <BlogViewDesktop data={data} />;
}
