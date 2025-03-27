"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material"
import { createCategory, putCategory, deleteCategory } from "../services/categoriesService"

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
    <Dialog open={categoryDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : isEdit ? "Update" : "Add Category"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

