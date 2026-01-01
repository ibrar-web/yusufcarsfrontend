"use client";

import { BlogManagement } from "@/components/blogs/blog-management";

export default function SupplierBlogsPage() {
  return (
    <div className="space-y-6">
      <BlogManagement
        context="supplier"
        title="My blog posts"
        description="Share expertise with motorists and highlight your workshop."
      />
    </div>
  );
}
