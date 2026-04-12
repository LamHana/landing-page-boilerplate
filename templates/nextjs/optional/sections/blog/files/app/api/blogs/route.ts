import { type NextRequest, NextResponse } from "next/server";
import { getBlogsByCategory } from "@/lib/blog-api";

// GET /api/blogs?category=all&page=1&pageSize=9999
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? "all";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "9999", 10);

  const blogs = await getBlogsByCategory({ category, page, pageSize });

  return NextResponse.json({ blogs });
}
