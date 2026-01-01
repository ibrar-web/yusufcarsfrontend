"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createBlog,
  getBlogDetail,
  listBlogs,
  removeBlog,
  updateBlog,
} from "@/services/blogs";
import type {
  BlogRecord,
  BlogStatus,
  BlogUpsertPayload,
} from "@/types/blog";
import useDebounce from "@/components/debouncedSearch/debouncedSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit3,
  Eye,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

type BlogManagementProps = {
  context: "admin" | "supplier";
  title?: string;
  description?: string;
};

const statusOptions: Array<{ label: string; value: BlogStatus | "all" }> = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

type BlogFormValues = {
  title: string;
  content: string;
  categories: string;
  images: string;
  videoUrl: string;
  references: string;
  seoTitle: string;
  seoDescription: string;
  seoImageUrl: string;
};

const EMPTY_FORM_VALUES: BlogFormValues = {
  title: "",
  content: "",
  categories: "",
  images: "",
  videoUrl: "",
  references: "",
  seoTitle: "",
  seoDescription: "",
  seoImageUrl: "",
};

const listToInput = (list?: string[] | null) =>
  list && list.length ? list.join(", ") : "";

const parseListInput = (value: string) => {
  const items = value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
};

const toFormValues = (blog?: BlogRecord | null): BlogFormValues => ({
  title: blog?.title ?? "",
  content: blog?.content ?? "",
  categories: listToInput(blog?.categories),
  images: listToInput(blog?.images),
  videoUrl: blog?.videoUrl ?? "",
  references: listToInput(blog?.references),
  seoTitle: blog?.seoTitle ?? "",
  seoDescription: blog?.seoDescription ?? "",
  seoImageUrl: blog?.seoImageUrl ?? "",
});

const toPayload = (values: BlogFormValues): BlogUpsertPayload => ({
  title: values.title.trim(),
  content: values.content.trim(),
  categories: parseListInput(values.categories),
  images: parseListInput(values.images),
  videoUrl: values.videoUrl ? values.videoUrl.trim() : null,
  references: parseListInput(values.references),
  seoTitle: values.seoTitle ? values.seoTitle.trim() : null,
  seoDescription: values.seoDescription ? values.seoDescription.trim() : null,
  seoImageUrl: values.seoImageUrl ? values.seoImageUrl.trim() : null,
});

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const truncate = (value: string, length = 120) =>
  value.length > length ? `${value.slice(0, length).trim()}…` : value;

const statusIntent: Record<Exclude<BlogStatus, undefined>, string> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-800",
};

export function BlogManagement({
  context,
  title = "Blog management",
  description = "Create, edit, and publish educational articles.",
}: BlogManagementProps) {
  const allowDelete = context === "admin";
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composerMode, setComposerMode] = useState<"create" | "edit">("create");
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerSubmitting, setComposerSubmitting] = useState(false);
  const [composerTarget, setComposerTarget] = useState<BlogRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailBlog, setDetailBlog] = useState<BlogRecord | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const searchQuery = useDebounce(searchFilter, 400);
  const categoriesQuery = useDebounce(categoryFilter, 400);

  const form = useForm<BlogFormValues>({
    defaultValues: EMPTY_FORM_VALUES,
  });

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items, meta: listMeta } = await listBlogs({
        page,
        limit: pageSize,
        search: searchQuery || undefined,
        category: categoriesQuery || undefined,
        status: statusFilter,
      });
      setBlogs(items);
      setMeta({
        total: listMeta.total ?? items.length,
        page: listMeta.page ?? page,
        limit: listMeta.limit ?? pageSize,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load blogs. Please try again.";
      setError(message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, categoriesQuery, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const resetComposerState = useCallback(() => {
    setComposerMode("create");
    setComposerTarget(null);
    form.reset(EMPTY_FORM_VALUES);
  }, [form]);

  const openCreateDialog = () => {
    resetComposerState();
    setComposerOpen(true);
  };

  const openEditDialog = (blog: BlogRecord) => {
    setComposerMode("edit");
    setComposerTarget(blog);
    form.reset(toFormValues(blog));
    setComposerOpen(true);
  };

  const handleComposerSubmit = form.handleSubmit(async (values) => {
    const payload = toPayload(values);
    try {
      setComposerSubmitting(true);
      if (composerMode === "edit" && composerTarget) {
        await updateBlog(composerTarget.id, payload);
        toast.success("Blog updated.");
      } else {
        await createBlog(payload);
        toast.success("Blog created.");
      }
      setComposerOpen(false);
      resetComposerState();
      fetchBlogs();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to save the blog."
      );
    } finally {
      setComposerSubmitting(false);
    }
  });

  const openDetailDialog = async (blog: BlogRecord) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailBlog(blog);
    try {
      const fresh = await getBlogDetail(blog.slug ?? blog.id);
      setDetailBlog(fresh);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to load this blog. Please try again."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const openDeleteDialog = (blog: BlogRecord) => {
    setDeleteTarget(blog);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await removeBlog(deleteTarget.id);
      toast.success("Blog removed.");
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete this blog."
      );
    } finally {
      setDeleting(false);
    }
  };

  const derivedCategories = useMemo(() => {
    const entries = new Set<string>();
    blogs.forEach((blog) =>
      blog.categories?.forEach((category) => {
        if (category) entries.add(category);
      })
    );
    return Array.from(entries);
  }, [blogs]);

  const totalItems = meta.total ?? blogs.length;

  return (
    <Card className="w-full border-border/60 bg-background/80 shadow-md">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={fetchBlogs}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New blog
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearchFilter(searchInput.trim());
              setPage(1);
            }}
            className="lg:col-span-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="pl-9"
                placeholder="Search by title, content, or author…"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchFilter("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCategoryFilter(categoryInput.trim());
              setPage(1);
            }}
          >
            <Input
              value={categoryInput}
              onChange={(event) => setCategoryInput(event.target.value)}
              placeholder="Filter by category"
            />
          </form>
          <Select
            value={statusFilter}
            onValueChange={(value: BlogStatus | "all") => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading blogs…
                    </div>
                  </TableCell>
                </TableRow>
              ) : blogs.length ? (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{blog.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {truncate(
                            blog.seoDescription ??
                              blog.excerpt ??
                              blog.content ??
                              ""
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {blog.categories?.length ? (
                          blog.categories.map((category) => (
                            <Badge
                              key={`${blog.id}-${category}`}
                              variant="outline"
                            >
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {blog.status ? (
                        <Badge
                          className={cn(
                            "capitalize",
                            statusIntent[blog.status] ??
                              "bg-slate-200 text-slate-800"
                          )}
                        >
                          {blog.status}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(blog.updatedAt)}</TableCell>
                    <TableCell>
                      {typeof blog.views === "number"
                        ? blog.views.toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetailDialog(blog)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(blog)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        {allowDelete ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(blog)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <p className="text-lg font-semibold">
                        No blogs found for your filters.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error ??
                          "Try adjusting the filters or creating a new post."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />

        {derivedCategories.length ? (
          <div className="text-xs text-muted-foreground">
            Popular categories: {derivedCategories.join(", ")}
          </div>
        ) : null}
      </CardContent>

      <Dialog
        open={composerOpen}
        onOpenChange={(open) => {
          setComposerOpen(open);
          if (!open) {
            resetComposerState();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {composerMode === "edit" ? "Edit blog" : "Create a blog"}
            </DialogTitle>
            <DialogDescription>
              Provide rich details, media, and SEO metadata.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleComposerSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "A title is required." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Headline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                rules={{ required: "Content cannot be empty." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={8}
                        placeholder="Write the story, you can paste markdown or HTML."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Comma separated e.g. EV, Maintenance"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="One or multiple URLs separated by commas"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/…" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>References</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Source links separated by commas or new lines"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border border-dashed border-border/50 p-4">
                <p className="mb-4 text-sm font-semibold text-muted-foreground">
                  SEO metadata
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Displayed in SERP" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO image</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Open Graph / social preview"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>SEO description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Short preview for search engines"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setComposerOpen(false);
                    resetComposerState();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={composerSubmitting}>
                  {composerSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : composerMode === "edit" ? (
                    "Update blog"
                  ) : (
                    "Publish blog"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{detailBlog?.title ?? "Blog details"}</DialogTitle>
            <DialogDescription>
              {detailBlog?.author?.displayName
                ? `By ${detailBlog.author.displayName}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading blog details…
            </div>
          ) : (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              {detailBlog?.categories?.length ? (
                <div className="flex flex-wrap gap-2">
                  {detailBlog.categories.map((category) => (
                    <Badge key={`${detailBlog.id}-${category}`} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              ) : null}
              {detailBlog?.content ? (
                /<\/?[a-z][\s\S]*>/i.test(detailBlog.content) ? (
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: detailBlog.content }}
                  />
                ) : (
                  detailBlog.content.split("\n").map((paragraph, index) => (
                    <p key={`paragraph-${index}`}>{paragraph}</p>
                  ))
                )
              ) : (
                <p>No content available.</p>
              )}
              {detailBlog?.references?.length ? (
                <div>
                  <p className="font-semibold text-foreground">References</p>
                  <ul className="list-disc space-y-1 pl-6">
                    {detailBlog.references.map((reference) => (
                      <li key={reference}>
                        <a
                          href={reference}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline"
                        >
                          {reference}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected article will be removed
              permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
