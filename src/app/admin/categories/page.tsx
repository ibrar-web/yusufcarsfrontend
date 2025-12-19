"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
// import { TablePagination } from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { toast } from "sonner";
import {
  Edit3,
  Eye,
  Grid3x3,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

interface AdminCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface CategoriesResponse {
  data?: {
    data?: AdminCategory[];
    meta?: {
      total?: number;
      page?: number;
      limit?: number;
    };
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  total?: number;
}

type CategoryCreateResponse =
  | AdminCategory
  | { data?: AdminCategory | null }
  | { category?: AdminCategory | null };

const normalizeCategories = (payload: unknown): AdminCategory[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as AdminCategory[];
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) {
      return record.data as AdminCategory[];
    }
    if (
      record.data &&
      typeof record.data === "object" &&
      Array.isArray((record.data as { data?: AdminCategory[] }).data)
    ) {
      return (
        ((record.data as { data?: AdminCategory[] }).data ?? []) as AdminCategory[]
      );
    }
    if (Array.isArray(record.items)) {
      return record.items as AdminCategory[];
    }
  }
  return [];
};

// const formatDate = (value?: string | null) => {
//   if (!value) return "—";
//   const parsed = new Date(value);
//   if (Number.isNaN(parsed.getTime())) return value;
//   return parsed.toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  // const debouncedSearch = useDebounce(searchTerm, 500);
  // const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [editingSlug, setEditingSlug] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCategories = useCallback(
    // async ({ requestedPage = 1, requestedPageSize = 20 } = {}) => {
    async () => {
      setIsLoading(true);
      try {
        // const params = {
        //   page: requestedPage,
        //   pageSize: requestedPageSize,
        //   search: debouncedSearch || undefined,
        // };
        const response = await apiGet<CategoriesResponse>(
          apiRoutes.admin.categories.list
          // ,
          // { params }
        );
        const payload = response?.data?.data ?? response?.data ?? response;
        const normalized = normalizeCategories(payload ?? []);
        // const total =
        //   response?.data?.meta?.total ??
        //   response?.meta?.total ??
        //   response?.total ??
        //   normalized.length;
        setCategories(normalized);
        // setTotalCategories(total);
        // setPage(requestedPage);
        // setPageSize(requestedPageSize);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load categories"
        );
      } finally {
        setIsLoading(false);
      }
    },
    // [debouncedSearch]
    []
  );
  
  useEffect(() => {
    fetchCategories();
  // }, [fetchCategories, pageSize]);
  }, [fetchCategories]);

  const displayedCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((category) =>
      `${category.name} ${category.id}`.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const handleViewSubcategories = (category: AdminCategory) => {
    router.push(`/admin/subcategories?parentId=${category.id}&name=${encodeURIComponent(category.name)}`);
  };

  const openEditDialog = (category: AdminCategory) => {
    setSelectedCategory(category);
    setEditingName(category.name);
    setEditingSlug(category?.slug ?? "");
    setEditingDescription(category.description ?? "");
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: AdminCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    setIsSaving(true);
    try {
      const payload = {
        name: editingName?.trim(),
        slug: editingSlug?.trim(),
        description: editingDescription?.trim() || undefined,
      };
      await apiPatch(
        apiRoutes.admin.categories.update(selectedCategory.id),
        payload
      );
      setCategories((prev) =>
        prev.map((category) =>
          category.id === selectedCategory.id
            ? { ...category, ...payload }
            : category
        )
      );
      toast.success("Category updated successfully");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    try {
      await apiDelete(apiRoutes.admin.categories.delete(selectedCategory.id));
      setCategories((prev) =>
        prev.filter((category) => category.id !== selectedCategory.id)
      );
      setTotalCategories((prev) => Math.max(0, prev - 1));
      toast.success("Category removed");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    setIsCreating(true);
    try {
      const payload = {
        name: newCategoryName.trim(),
        slug: slug,
        description: newCategoryDescription.trim() || undefined,
      };
      const response = await apiPost<CategoryCreateResponse>(
        apiRoutes.admin.categories.create,
        payload
      );
      let createdCategory: AdminCategory | undefined;
      if (response && typeof response === "object") {
        if ("data" in response && response.data) {
          createdCategory = response.data as AdminCategory;
        } else if ("category" in response && response.category) {
          createdCategory = response.category as AdminCategory;
        } else if ("id" in response) {
          createdCategory = response as AdminCategory;
        }
      }

      if (!createdCategory) {
        createdCategory = {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `tmp-${Date.now()}`,
          ...payload,
        };
      }

      setCategories((prev) => [createdCategory, ...prev]);
      setTotalCategories((prev) => prev + 1);
      setNewCategoryName("");
      setSlug("");
      setNewCategoryDescription("");
      setCreateDialogOpen(false);
      toast.success("Category created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // const handlePageChange = (nextPage: number) => {
  //   fetchCategories({ requestedPage: nextPage, requestedPageSize: pageSize });
  // };

  // const handlePageSizeChange = (nextSize: number) => {
  //   fetchCategories({ requestedPage: 1, requestedPageSize: nextSize });
  // };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FDE68A] via-[#FEF3C7] to-white border-2 border-[#F59E0B]/30 p-6 shadow-[0_0_24px_rgba(245,158,11,0.18)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#F59E0B]/40">
              <Grid3x3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-1 text-[#0F172A] font-['Inter'] font-bold">
                Categories
              </h2>
              <p className="text-base text-[#475569] font-['Roboto']">
                {totalCategories || categories.length} categories in your catalogue
              </p>
            </div>
          </div>
          <Button
            className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full shadow-md cursor-pointer"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#475569]" />
          <Input
            type="text"
            placeholder="Search categories by name or ID"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8] w-full"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#475569] hover:text-[#F02801] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Card className="border-2 border-[#E2E8F0] shadow-lg">
        <CardHeader className="border-b border-[#E5E7EB] bg-[#F8FAFC] rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-['Inter'] text-xl text-[#0F172A]">
                Category Catalogue
              </CardTitle>
              <CardDescription className="font-['Roboto'] text-[#475569] mt-1">
                Manage the categories suppliers can choose from
              </CardDescription>
            </div>
            <Badge className="rounded-full bg-[#E0E7FF] text-[#4338CA] font-['Roboto']">
              {displayedCategories.length} results
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="border-[#E5E7EB]">
                  <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                    Category ID
                  </TableHead>
                  <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                    Name
                  </TableHead>
                  {/* <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                    Created
                  </TableHead> */}
                  <TableHead className="text-right text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs pr-6">
                    Actions
                  </TableHead>
                  <TableHead className="text-right text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs pr-6">
                  </TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`category-skeleton-${index}`} className="border-[#F1F5F9]">
                      <TableCell colSpan={4} className="py-6">
                        <div className="h-6 w-full rounded-md bg-[#F1F5F9] animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : displayedCategories.length > 0 ? (
                  displayedCategories.map((category) => (
                    <TableRow key={category.id} className="border-[#F1F5F9]">
                      <TableCell className="font-['Inter'] text-[#0F172A]">
                        {category.id}
                      </TableCell>
                      <TableCell className="font-['Roboto'] text-[#0F172A]">
                        {category.name}
                        {category.description && (
                          <p className="text-sm text-[#64748B] mt-1">
                            {category.description}
                          </p>
                        )}
                      </TableCell>
                      {/* <TableCell className="font-['Roboto'] text-[#475569]">
                        {formatDate(category.createdAt)}
                      </TableCell> */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#0F172A] hover:bg-[#FEF3F2] cursor-pointer"
                            onClick={() => openEditDialog(category)}
                            aria-label={`Edit ${category.name}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                            onClick={() => openDeleteDialog(category)}
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#E2E8F0] text-[#0F172A] cursor-pointer"
                            onClick={() => handleViewSubcategories(category)}
                          >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-[#CBD5E1]" />
                        <p className="text-[#475569] font-['Roboto']">
                          No categories found matching "{searchTerm}"
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full cursor-pointer"
                        >
                          Clear Search
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end">
            <TablePagination
              page={page}
              pageSize={pageSize}
              totalItems={totalCategories}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              className="w-full"
            />
          </div> */}
        </CardContent>
      </Card>


      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-xl text-[#0F172A]">
              Edit Category
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Update the category name or description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                Name
              </p>
              <Input
                value={editingName}
                onChange={(event) => setEditingName(event.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                slug
              </p>
              <Input
                value={editingSlug}
                onChange={(event) => setEditingSlug(event.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                Description
              </p>
              <Textarea
                value={editingDescription}
                onChange={(event) => setEditingDescription(event.target.value)}
                placeholder="Short description (optional)"
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setEditDialogOpen(false)}
              className="text-[#475569] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#F02801] hover:bg-[#D22301] text-white"
              onClick={() =>handleUpdateCategory()}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin cursor-pointer" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-xl text-[#0F172A]">
              Delete Category
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              This action cannot be undone. Are you sure you want to remove this
              category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" className="cursor-pointer" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="text-white cursor-pointer"
              onClick={() => handleDeleteCategory()}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-xl text-[#0F172A]">
              Create Category
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Add a new category to keep your marketplace organised
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                Name
              </p>
              <Input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Brake Components"
              />
            </div>
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                Slug
              </p>
              <Input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="Brake Components"
              />
            </div>
            <div>
              <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                Description
              </p>
              <Textarea
                value={newCategoryDescription}
                onChange={(event) => setNewCategoryDescription(event.target.value)}
                placeholder="Short summary to help suppliers understand the category"
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" className="cursor-pointer" onClick={() => {
              setCreateDialogOpen(false);
              setNewCategoryName("");
              setSlug("");
              setNewCategoryDescription("");
            }}>
              Cancel
            </Button>
            <Button
              className="text-white cursor-pointer"
              onClick={() => handleCreateCategory()}
              disabled={isCreating}
            >
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
