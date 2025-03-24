"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material"
import { fetchPostWithAuth } from "../services/security/fetchWithAuth"
import { useAuthUser } from "../services/security/AuthContext";


export default function ProblemDialog({ open, onClose, categories, onAddProblem }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { isAuthenticated, user } = useAuthUser();
  const [formData, setFormData] = useState({
    problemName: "",
    description: "",
    source: "",
    difficulty: "", 
    createdById: null,
    categoryId: "",
  })

  console.log("User:", user);


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.problemName.trim()) {
      newErrors.problemName = "Problem name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required"
    }

    if (!formData.difficulty) {
      newErrors.difficulty = "Difficulty is required"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }
    

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function insertProblem(problemData) {
    // const data = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/problems`, problemData)

    const data = await fetch(`${process.env.REACT_APP_API_URL}/problems`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(problemData)
    });

    if (data.ok) {
      const problem = await data.json()
      return problem
    } else {
      throw new Error("Failed to create problem")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    if (isAuthenticated && user?.id) {
      setFormData(prevFormData => ({
        ...prevFormData,
        createdById: user.id
      }));
    }

    try {
      const newProblem = await insertProblem(formData)
      onAddProblem(newProblem)
      resetForm()
    } catch (error) {
      console.error("Error creating problem:", error)
      setErrors({
        ...errors,
        form: "Failed to create problem. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      problemName: "",
      description: "",
      source: "",
      difficulty: "", 
      createdById: null,
      categoryId: "",
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Problem</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              name="problemName"
              label="Problem Name"
              type="text"
              fullWidth
              value={formData.problemName}
              onChange={handleChange}
              error={!!errors.problemName}
              helperText={errors.problemName}
              disabled={loading}
            />

            <TextField
              margin="dense"
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
            />

            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                margin="dense"
                name="source"
                label="Source (Optional)"
                type="text"
                fullWidth
                value={formData.source}
                onChange={handleChange}
                disabled={loading}
              />

              <FormControl fullWidth margin="dense" error={!!errors.difficulty}>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  label="Difficulty"
                  disabled={loading}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
                {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
              </FormControl>
            </Box>

            <FormControl fullWidth margin="dense" error={!!errors.categoryId}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                label="Category"
                disabled={loading}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
            </FormControl>

            {errors.form && <FormHelperText error>{errors.form}</FormHelperText>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Add Problem"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

