"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit3,
  FolderTree,
  Loader2,
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

export default function AdminSubcategoriesPage() {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<AdminCategory[]>([]);
  const [isSubcategoryLoading, setIsSubcategoryLoading] = useState(false);
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<AdminCategory | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchParams = useSearchParams();
  const parentCategoryId = searchParams.get("parentId");
  const parentCategoryName = searchParams.get("name") ?? "Selected Category";


  const fetchSubcategories = useCallback(async (categoryId: string) => {
    setIsSubcategoryLoading(true);
    try {
      const response = await apiGet(
        apiRoutes.admin.subcategories.list(categoryId)
      );
      const payload = response?.data?.subcategories ?? response?.data ?? response;
      setSubcategories(normalizeCategories(payload ?? []));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load subcategories"
      );
    } finally {
      setIsSubcategoryLoading(false);
    }
  }, []);
  useEffect(() => {
    if (parentCategoryId) {
      setSubcategorySearch("");
      fetchSubcategories(parentCategoryId);
    }
  }, [parentCategoryId, fetchSubcategories]);

  const filteredSubcategories = useMemo(() => {
    const term = subcategorySearch.trim().toLowerCase();
    if (!term) return subcategories;
    return subcategories.filter((subcategory) =>
      `${subcategory.name} ${subcategory.id}`.toLowerCase().includes(term)
    );
  }, [subcategorySearch, subcategories]);

  if (!parentCategoryId) {
    return (
      <div className="p-8">
        <p className="text-[#B91C1C]">No category selected.</p>
      </div>
    );
  }

  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setFormDescription("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleOpenEdit = (subcategory: AdminCategory) => {
    setSelectedSubcategory(subcategory);
    setFormName(subcategory.name);
    setFormSlug(subcategory?.slug);
    setFormDescription(subcategory.description ?? "");
    setEditDialogOpen(true);
  };

  const handleOpenDelete = (subcategory: AdminCategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteDialogOpen(true);
  };

  const handleCreateSubcategory = async () => {
    if (!parentCategoryId || !formName.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug?.trim(),
        description: formDescription.trim() || undefined,
      };
      const response = await apiPost<AdminCategory>(
        apiRoutes.admin.subcategories.create(parentCategoryId),
        payload
      );
      console.log("create response.  ", {response});
      
      const created = response?.data;
      setSubcategories((prev) => [created, ...prev]);
      resetForm();
      setCreateDialogOpen(false);
      toast.success("Subcategory created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create subcategory"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!parentCategoryId || !selectedSubcategory) return;
    setIsSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        slug:formSlug?.trim(),
        description: formDescription.trim() || undefined,
      };
      await apiPatch(
        apiRoutes.admin.subcategories.update(
          selectedSubcategory.id
        ),
        payload
      );
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubcategory.id ? { ...sub, ...payload } : sub
        )
      );
      setEditDialogOpen(false);
      toast.success("Subcategory updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update subcategory"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!parentCategoryId || !selectedSubcategory) return;
    setIsDeleting(true);
    try {
      await apiDelete(
        apiRoutes.admin.subcategories.delete(
          selectedSubcategory.id
        )
      );
      setSubcategories((prev) =>
        prev.filter((sub) => sub.id !== selectedSubcategory.id)
      );
      setDeleteDialogOpen(false);
      toast.success("Subcategory deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete subcategory"
      );
    } finally {
      setIsDeleting(false);
    }
  };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="rounded-full border border-[#E2E8F0] text-[#0F172A] cursor-pointer"
            onClick={() => router.push("/admin/categories")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          <div className="flex items-center gap-2 text-[#475569] font-['Roboto']">
            <FolderTree className="h-5 w-5 text-[#F97316]" />
            <span>Subcategories for</span>
            <span className="font-semibold text-[#0F172A]">{parentCategoryName}</span>
          </div>
        </div>

        <Card className="border-2 border-[#E2E8F0] shadow-lg">
          <CardHeader className="border-b border-[#E5E7EB] bg-[#F8FAFC] rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-['Inter'] text-xl text-[#0F172A]">
                  Subcategory Catalogue
                </CardTitle>
                <CardDescription className="font-['Roboto'] text-[#475569] mt-1">
                  Manage child categories for {parentCategoryName}
                </CardDescription>
              </div>
              <Badge className="rounded-full bg-[#E0E7FF] text-[#4338CA] font-['Roboto']">
                {filteredSubcategories.length} results
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b border-[#E5E7EB]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    value={subcategorySearch}
                    onChange={(event) => setSubcategorySearch(event.target.value)}
                    placeholder="Search subcategories"
                    className="pl-12 h-12 border-[#E5E7EB] rounded-full focus:border-[#F02801] focus:ring-[#F02801]"
                  />
                </div>
                <Button
                  className="rounded-full bg-[#F02801] text-white font-['Roboto'] hover:bg-[#D22301] cursor-pointer"
                  onClick={() => handleOpenCreate()}
                >
                  Add Subcategory
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-[#E5E7EB]">
                    <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                      ID
                    </TableHead>
                    <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                      Name
                    </TableHead>
                    <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                      slug
                    </TableHead>
                    <TableHead className="text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs">
                      Description
                    </TableHead>
                    <TableHead className="text-right text-[#475569] font-['Roboto'] uppercase tracking-wide text-xs pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isSubcategoryLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`subcategory-skeleton-${index}`}>
                        <TableCell colSpan={3}>
                          <div className="h-5 w-full rounded bg-[#F1F5F9] animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredSubcategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <Search className="h-10 w-10 text-[#CBD5E1]" />
                          <p className="text-[#475569] font-['Roboto']">
                            No subcategories found.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubcategories.map((subcategory) => (
                      <TableRow key={subcategory.id} className="border-[#F1F5F9]">
                        <TableCell className="font-['Inter'] text-[#0F172A]">
                          {subcategory.id}
                        </TableCell>
                        <TableCell className="font-['Roboto'] text-[#0F172A]">
                          {subcategory.name}
                        </TableCell>
                        <TableCell className="font-['Roboto'] text-[#0F172A]">
                          {subcategory.slug}
                        </TableCell>
                        <TableCell className="font-['Roboto'] text-[#475569]">
                          {subcategory.description || "—"}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#0F172A] hover:bg-[#FEF3F2] cursor-pointer"
                              onClick={() => handleOpenEdit(subcategory)}
                              aria-label={`Edit ${subcategory.name}`}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                              onClick={() => handleOpenDelete(subcategory)}
                              aria-label={`Delete ${subcategory.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-['Inter'] text-xl text-[#0F172A]">
                Add Subcategory
              </DialogTitle>
              <DialogDescription className="font-['Roboto'] text-[#475569]">
                Create a new child category under {parentCategoryName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Name</p>
                <Input
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="Brake Discs"
                />
              </div>
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">slug</p>
                <Input
                  value={formSlug}
                  onChange={(event) => setFormSlug(event.target.value)}
                  placeholder="Brake Discs"
                />
              </div>
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                  Description
                </p>
                <Textarea
                  value={formDescription}
                  onChange={(event) => setFormDescription(event.target.value)}
                  placeholder="Short description (optional)"
                  className="min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="ghost" className="cursor-pointer" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="text-white cursor-pointer"
                onClick={() => handleCreateSubcategory()}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-['Inter'] text-xl text-[#0F172A]">
                Edit Subcategory
              </DialogTitle>
              <DialogDescription className="font-['Roboto'] text-[#475569]">
                Update the selected subcategory details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Name</p>
                <Input
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Slug</p>
                <Input
                  value={formSlug}
                  onChange={(event) => setFormSlug(event.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-1">
                  Description
                </p>
                <Textarea
                  value={formDescription}
                  onChange={(event) => setFormDescription(event.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="ghost" className="cursor-pointer" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="cursor-pointer text-white"
                onClick={() => handleUpdateSubcategory()}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-['Inter'] text-xl text-[#0F172A]">
                Delete Subcategory
              </DialogTitle>
              <DialogDescription className="font-['Roboto'] text-[#475569]">
                This action cannot be undone. Are you sure you want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" className="cursor-pointer" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="text-white cursor-pointer"
                onClick={() => handleDeleteSubcategory()}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}
