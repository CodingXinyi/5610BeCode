"use client"

import { useState, useEffect } from "react"
import { createCategory, putCategory } from "../services/categoryService"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"


export default function CategoryDialog({ categoryDialogOpen, setCategoryDialogOpen, categories, setCategories, isEdit = false, changeCategory = null }) {
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Set initial value when editing
  useEffect(() => {
    if (isEdit && changeCategory) {
      setCategoryName(changeCategory.categoryName)
    }
  }, [isEdit, changeCategory])


  const handleInsertCategory = async (categoryName) => {
    try {
        const data = { categoryName }; // Declare 'data' with 'const'
        const response = await createCategory(data);

        console.log("handleInsertCategory", response)

        if (response) {
            setCategories([...categories, response]);
            setCategoryDialogOpen(false);
        } else {
            throw new Error("Failed to create/insert category");
        }
    } catch (error) {
        console.error("Error creating category:", error);
        setError("Failed to create category. Please try again.");
    }
  };


  const handleUpdateCategory = async (id, updateCategoryName) => {
      try {
          // console.log("handleUpdateCategory==", changeCategory, "===", id, categoryName, updateCategoryName)
          const data = { "categoryName" : updateCategoryName }; // Declare 'data' with 'const'
          const response = await putCategory(id, data);

          console.log("handleUpdateCategory", response)

          if (response) {
              const updatedCategories = categories.map((cat) => 
                  cat.id === id ? { ...cat, ...data } : cat // Fix incorrect ID reference
              );
              setCategories(updatedCategories);
              setCategoryDialogOpen(false);
          } else {
              throw new Error("Failed to update category");
          }
      } catch (error) {
          console.error("Error updating category:", error);
          setError("Failed to update category. Please try again.");
      }
  };



  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      setError("Category name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isEdit) {
        // Update existing category
        handleUpdateCategory(changeCategory.id, categoryName)
      } else {
        // Create new category
        await handleInsertCategory(categoryName)
      }

      if (!isEdit) {
        setCategoryName("") // Only clear when adding new
      }
    } catch (error) {
      console.error(isEdit ? "Error updating category:" : "Error creating category:", error)
      setError(isEdit ? "Failed to update category. Please try again." : "Failed to create category. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  const handleClose = () => {
    if (!isEdit) {
      setCategoryName("")
    }
    setError("")
    setCategoryDialogOpen(false)
  }


  return (
    <Dialog open={categoryDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update an existing category name." : "Enter the new category name below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={loading}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 animate-spin border-2 border-t-transparent border-white rounded-full" />
              ) : isEdit ? "Update" : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

