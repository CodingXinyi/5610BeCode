"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material"
import { fetchPostWithAuth, fetchPutWithAuth } from "../services/security/fetchWithAuth"

export default function CategoryDialog({ open, onClose, onAddCategory, isEdit = false, category = null }) {
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Set initial value when editing
  useEffect(() => {
    if (isEdit && category) {
      setCategoryName(category.categoryName)
    }
  }, [isEdit, category])

  async function insertCategory(categoryName) {
    const data = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/categories`, {
      categoryName: categoryName,
    })

    if (data.ok) {
      const todo = await data.json()
      return todo
    } else {
      throw new Error("Failed to create category")
    }
  }

  async function updateCategory(id, categoryName) {
    const data = await fetchPutWithAuth(`${process.env.REACT_APP_API_URL}/categories/${id}`, {
      categoryName: categoryName,
    })

    if (data.ok) {
      const updated = await data.json()
      return updated
    } else {
      throw new Error("Failed to update category")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      setError("Category name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      let result
      if (isEdit) {
        // Update existing category
        result = await updateCategory(category.id, categoryName)
      } else {
        // Create new category
        result = await insertCategory(categoryName)
      }

      onAddCategory(result)
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
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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

