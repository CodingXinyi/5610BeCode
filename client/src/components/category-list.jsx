"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Edit, Trash2, FolderOpen } from "lucide-react"
import ProblemItem from "./problem-item"
import CategoryDialog from "./category-dialog"
import { putCategory, deleteCategory } from "../services/categoryService"


export default function CategoryList({ categories, isLoggedIn, setCategories, problemsByCategory, setProblemsByCategory }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEditClick = (category) => {
    if (!isLoggedIn) {
      alert("Please login to edit categories");
      return;
    }
  
    setSelectedCategory(category)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (category) => {
    if (!isLoggedIn) {
      alert("Please login to edit categories");
      return;
    }
  
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }


  const handleDeleteCategory = async (selectDeleteCategory) => {
    setLoading(true)
    try {
      const data = await deleteCategory(selectDeleteCategory.id)

      if (data) {
        // Remove the category from the list
        const updatedCategories = categories.filter((cat) => cat.id !== selectDeleteCategory.id);
        setCategories(updatedCategories);
        setDeleteDialogOpen(false);
      } else {
        throw new Error("Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  

  if (!categories || categories.length === 0) {
    return (
      <div className="material-card p-6 text-center">
        <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          No categories found. {isLoggedIn ? "Create your first category!" : "Please login to create categories."}
        </p>
      </div>
    )
  }


  return (
    <div className="space-y-4 min-h-[400px]">
      {categories.map((category, index) => (
        <Accordion
          type="multiple"
          collapsible
          key={category.id}
          className="material-card overflow-hidden animate-fade-in"
          // defaultValue={index === 0 ? `panel-${category.id}` : undefined}
          defaultValue={categories.map((category) => `panel-${category.id}`)}
        >
          <AccordionItem value={`panel-${category.id}`} className="border-0 min-h-[60px]">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 bg-muted">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold">{category.categoryName}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(category)
                      }}
                      disabled={!isLoggedIn}
                      className="h-8 w-8 rounded-full hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(category)
                      }}
                      disabled={!isLoggedIn}
                      className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                  <span className="category-chip">{`${problemsByCategory[category.id]?.length || 0} Problems`}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="grid grid-cols-5 gap-4 p-3 border-t border-b text-xs font-medium text-muted-foreground">
                <div>Problem Title</div>
                <div className="text-center">Difficulty</div>
                <div className="text-center">Source</div>
                <div className="text-center">Solution</div>
                <div className="text-center">Actions</div>
              </div>

              {problemsByCategory[category.id]?.length > 0 ? (
                <div className="divide-y">
                  {problemsByCategory[category.id].map((problem) => (
                    <ProblemItem
                      key={problem.id}
                      problem={problem}
                      isLoggedIn={isLoggedIn}
                      categories={categories}
                      problemsByCategory={problemsByCategory}
                      setProblemsByCategory={setProblemsByCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground min-h-[100px]">
                  No problems in this category yet.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      {selectedCategory && (
        <CategoryDialog
          categoryDialogOpen={editDialogOpen}
          setCategoryDialogOpen={setEditDialogOpen}
          categories={categories}
          setCategories={setCategories}
          isEdit={true}
          changeCategory={selectedCategory}
        />
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{selectedCategory?.categoryName}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedCategory && handleDeleteCategory(selectedCategory)}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


