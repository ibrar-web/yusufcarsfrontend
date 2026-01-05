import { NextRequest, NextResponse } from "next/server";
import { loadBlogPost } from "@/lib/blogs-service";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const result = await loadBlogPost(slug);
  return NextResponse.json(result);
}
