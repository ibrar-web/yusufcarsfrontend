import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import type {
  BlogDetailResponse,
  BlogListMeta,
  BlogListQuery,
  BlogListResponse,
  BlogRecord,
  BlogUpsertPayload,
} from "@/types/blog";

type NormalizedBlogList = {
  items: BlogRecord[];
  meta: BlogListMeta;
};

const DEFAULT_META: BlogListMeta = {
  total: 0,
  limit: 10,
  page: 1,
};

const coerceMeta = (candidate?: BlogListMeta | null): BlogListMeta => ({
  total:
    candidate?.total ??
    candidate?.["count" as keyof BlogListMeta] ??
    DEFAULT_META.total,
  limit: candidate?.limit ?? candidate?.["perPage" as keyof BlogListMeta] ?? DEFAULT_META.limit,
  page: candidate?.page ?? candidate?.["currentPage" as keyof BlogListMeta] ?? DEFAULT_META.page,
});

const coerceBlogArray = (candidate: unknown): BlogRecord[] => {
  if (!candidate) {
    return [];
  }

  if (Array.isArray(candidate)) {
    return candidate as BlogRecord[];
  }

  if (
    typeof candidate === "object" &&
    candidate !== null &&
    Array.isArray((candidate as { data?: BlogRecord[] }).data)
  ) {
    return ((candidate as { data?: BlogRecord[] }).data ?? []) as BlogRecord[];
  }

  return [];
};

const normalizeListPayload = (payload: BlogListResponse | unknown): NormalizedBlogList => {
  if (!payload) {
    return { items: [], meta: { ...DEFAULT_META } };
  }

  if (Array.isArray(payload)) {
    return { items: payload as BlogRecord[], meta: { ...DEFAULT_META } };
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as BlogListResponse;
    if (record.data && Array.isArray(record.data)) {
      return {
        items: record.data,
        meta: coerceMeta(record.meta ?? record),
      };
    }

    if (record.data && typeof record.data === "object") {
      const nested = record.data as { data?: BlogRecord[]; meta?: BlogListMeta };
      return {
        items: coerceBlogArray(nested.data ?? nested),
        meta: coerceMeta(record.meta ?? nested.meta ?? record),
      };
    }
  }

  return { items: [], meta: { ...DEFAULT_META } };
};

const unwrapBlog = (payload: BlogDetailResponse | unknown): BlogRecord => {
  if (!payload) {
    throw new Error("Blog not found.");
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as BlogDetailResponse;
    if ("data" in record && record.data) {
      return record.data as BlogRecord;
    }
    if ("blog" in record && record.blog) {
      return record.blog as BlogRecord;
    }
  }

  return payload as BlogRecord;
};

const buildQueryString = (query?: BlogListQuery) => {
  if (!query) return "";
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.category) params.set("category", query.category);
  if (query.authorId) params.set("authorId", query.authorId);

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
};

export async function listBlogs(
  query?: BlogListQuery
): Promise<NormalizedBlogList> {
  const suffix = buildQueryString(query);
  const payload = await apiGet<BlogListResponse>(
    `${apiRoutes.common.blogs.list}${suffix}`
  );
  return normalizeListPayload(payload);
}

async function fetchCollection(url: string): Promise<BlogRecord[]> {
  const payload = await apiGet<BlogListResponse>(url);
  return normalizeListPayload(payload).items;
}

export const fetchFeaturedBlogs = () =>
  fetchCollection(apiRoutes.common.blogs.featured);

export const fetchTrendingBlogs = () =>
  fetchCollection(apiRoutes.common.blogs.trending);

export async function getBlogDetail(identifier: string): Promise<BlogRecord> {
  const payload = await apiGet<BlogDetailResponse>(
    apiRoutes.common.blogs.detail(identifier)
  );
  return unwrapBlog(payload);
}

export async function createBlog(payload: BlogUpsertPayload) {
  const response = await apiPost<BlogDetailResponse>(
    apiRoutes.common.blogs.create,
    payload
  );
  return unwrapBlog(response);
}

export async function updateBlog(id: string, payload: BlogUpsertPayload) {
  const response = await apiPatch<BlogDetailResponse>(
    apiRoutes.common.blogs.update(id),
    payload
  );
  return unwrapBlog(response);
}

export async function removeBlog(id: string) {
  await apiDelete(apiRoutes.common.blogs.delete(id));
}
