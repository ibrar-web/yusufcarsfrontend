import { NextResponse } from "next/server";
import { listBlogSummaries } from "@/lib/blogs-service";

export async function GET() {
  const posts = listBlogSummaries();
  return NextResponse.json({
    count: posts.length,
    posts,
  });
}
