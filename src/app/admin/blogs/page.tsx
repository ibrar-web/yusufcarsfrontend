"use client";

import { BlogManagement } from "@/components/blogs/blog-management";

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6">
      <BlogManagement
        context="admin"
        title="Knowledge centre"
        description="Curate featured articles for the website and supplier community."
      />
    </div>
  );
}
