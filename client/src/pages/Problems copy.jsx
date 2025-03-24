"use client";

import { useState } from "react";
import { Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProblemCategory from "../components/category-list";
import AddProblemDialog from "../components/problem-dialog";
import { useAuthUser } from "../services/security/AuthContext";
import { useNavigate } from "react-router-dom";

const initialCategories = [
  { id: 1, name: "Arrays", problems: [] },
  { id: 2, name: "Dynamic Programming", problems: [] },
  { id: 3, name: "Sorting Algorithms", problems: [] },
];

function ProblemsList() {
  const [categories, setCategories] = useState(initialCategories);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState([1, 2, 3]);
  const { logout } = useAuthUser();
  const navigate = useNavigate();

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleAddProblem = (newProblem) => {
    const categoryId = Number.parseInt(newProblem.categoryId);
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              problems: [
                ...category.problems,
                {
                  id: Math.max(...prev.flatMap((c) => c.problems.map((p) => p.id))) + 1,
                  title: newProblem.title,
                  difficulty: newProblem.difficulty,
                  description: newProblem.description,
                },
              ],
            }
          : category
      )
    );
    setDialogOpen(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      
      const data = await response.json();
      setCategories([...categories, { id: data.id, name: newCategoryName, problems: [] }]);
      setCategoryDialogOpen(false);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding category", error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  return (
    <Container>
      <Typography variant="h3">Be Coding</Typography>
      <Button variant="contained" color="primary" onClick={() => setPeoblemDialogOpen(true)}>
        + Add a New Problem
      </Button>
      <Button variant="contained" color="secondary" onClick={() => setCategoryDialogOpen(true)}>
        + Add Category
      </Button>
      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>

      {categories.map((category) => (
        <Accordion key={category.id} expanded={expandedCategories.includes(category.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => toggleCategory(category.id)}>
            <Typography>{category.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProblemCategory category={category} />
          </AccordionDetails>
        </Accordion>
      ))}

      <AddProblemDialog
        isOpen={problemDialogOpen}
        onClose={() => setProblemDialogOpen(false)}
        categories={categories}
        onAddProblem={handleAddProblem}
      />

      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)}>
        <DialogTitle>Add a New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} color="primary" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProblemsList;
