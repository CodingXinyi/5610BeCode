"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Divider,
  Paper,
  Collapse,
  Typography,
  IconButton,
  // Chip,
  Grid,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ProblemItem from "./problem-item"
import CategoryDialog from "./category-dialog"
import { fetchDeleteWithAuth, fetchPutWithAuth } from "../services/security/fetchWithAuth"
import { putCategory, deleteCategory } from "../services/categoryService"


// Styled components
const ColumnHeaders = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: "#fafafa",
  marginBottom: theme.spacing(1),
}))



export default function CategoryList({ categories, isLoggedIn, setCategories, problemsByCategory, setProblemsByCategory }) {
  const [expanded, setExpanded] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

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
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1">
          No categories found. {isLoggedIn ? "Create your first category!" : "Please login to create categories."}
        </Typography>
      </Paper>
    )
  }


  return (
    <Box sx={{ mb: 4 }}>
      {categories.map((category) => (
        <Accordion
          key={category.id}
          expanded={expanded === `panel-${category.id}`}
          onChange={handleChange(`panel-${category.id}`)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${category.id}-content`}
            id={`panel-${category.id}-header`}
            sx={{
              // border: '1px solid #E5E7EB', // Equivalent to border-gray-200
              '&:hover': {
                backgroundColor: '#eeeeee', // Equivalent to hover:bg-gray-50
              },
              // '&:hover': {
              //   backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1F2937' : '#F9FAFB', // dark mode support
              // },
              backgroundColor: "#f5f5f5",
            }}
            // sx={{
            //   backgroundColor: "#e0e0e0",  // Background color
              // color: (theme) => theme.palette.text.primary,  // Text color
              // '& .MuiAccordionSummary-expandIcon': {
              //   color: (theme) => theme.palette.primary.light,  // Icon color
              // }
            // }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {category.categoryName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(category)}
                  disabled={!isLoggedIn}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(category)}
                  disabled={!isLoggedIn}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full">
                {`${problemsByCategory[category.id]?.length || 0} Problems`}
              </span>
              {/* <Chip label={`${problemsByCategory[category.id]?.length || 0} Problems`} color="white" size="small" /> */}
            </Box>
          </AccordionSummary>

        {/* insert problem into each category */}
        <AccordionDetails sx={{ p: 0 }}>
          {expanded === `panel-${category.id}` && (
            <ColumnHeaders container>
              <Grid item xs={2.4}>
                <Typography variant="subtitle2">Problem Title</Typography>
              </Grid>
              <Grid item xs={2.4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">Difficulty</Typography>
              </Grid>
              <Grid item xs={2.4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">Source</Typography>
              </Grid>
              <Grid item xs={2.4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">Solution</Typography>
              </Grid>
              <Grid item xs={2.4} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">Vote</Typography>
              </Grid>
            </ColumnHeaders>
          )}

        {/* {console.log("Problems for category", category.id, problemsByCategory[category.id])} */}
        {/* {console.log("Type of problemsByCategory[category.id]:", typeof problemsByCategory[category.id])} */}
          {problemsByCategory[category.id]?.length > 0 ? (
            <List>
              {problemsByCategory[category.id].map((problem, index) => (
                <Box key={problem.id}>
                  {index > 0 && <Divider component="li" />}
                  <ProblemItem 
                    problem={problem} 
                    isLoggedIn={isLoggedIn}
                    categories={categories}
                    problemsByCategory={problemsByCategory}
                    setProblemsByCategory={setProblemsByCategory}
                  />
                </Box>  
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              No problems in this category yet.{" "}
              {isLoggedIn ? "Add your first problem!" : "Please login to add problems."}
            </Typography>
          )}
        </AccordionDetails>
        </Accordion>
      ))}



      {/* Edit Category Dialog */}
      {/* categoryDialogOpen, setCategoryDialogOpen, categories, setCategories, isEdit = false, changeCategory = null */}
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


      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{selectedCategory?.categoryName}"? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => handleDeleteCategory(selectedCategory)} color="error" disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


