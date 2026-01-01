export type BlogStatus = "draft" | "published" | "archived";

export type BlogRole = "admin" | "supplier" | "user";

export interface BlogAuthor {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  role?: BlogRole | null;
}

export interface BlogRecord {
  id: string;
  slug?: string | null;
  title: string;
  content: string;
  excerpt?: string | null;
  readTimeMinutes?: number | null;
  categories?: string[] | null;
  images?: string[] | null;
  videoUrl?: string | null;
  references?: string[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImageUrl?: string | null;
  featured?: boolean;
  trendingScore?: number | null;
  views?: number | null;
  status?: BlogStatus | null;
  author?: BlogAuthor | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
}

export interface BlogListMeta {
  total?: number;
  page?: number;
  limit?: number;
}

export interface BlogListResponse {
  data?: BlogRecord[] | { data?: BlogRecord[]; meta?: BlogListMeta };
  meta?: BlogListMeta;
  total?: number;
  limit?: number;
  page?: number;
}

export type BlogDetailResponse =
  | BlogRecord
  | { data?: BlogRecord | null }
  | { blog?: BlogRecord | null };

export type BlogUpsertPayload = {
  title: string;
  content: string;
  categories?: string[];
  images?: string[];
  videoUrl?: string | null;
  references?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImageUrl?: string | null;
};

export type BlogListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogStatus | "all";
  category?: string;
  authorId?: string;
};
