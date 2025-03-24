"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, AppBar, Toolbar, Container, Paper } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import LogoutIcon from "@mui/icons-material/Logout"
import LoginIcon from "@mui/icons-material/Login"
import CategoryDialog from "../components/category-dialog"
import ProblemDialog from "../components/problem-dialog"
import CategoryList from "../components/category-list"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuthUser } from "../services/security/AuthContext";
import { useNavigate } from "react-router-dom";


function ProblemsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [categories, setCategories] = useState([])
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [openProblemDialog, setOpenProblemDialog] = useState(false)
  const { isAuthenticated, loading, user, login, register, logout } = useAuthUser();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    // This would be replaced with your actual auth check
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated)
    }

    checkAuth()
  }, [])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Put all the API endpoint in the Services folder later 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json()
        console.log("category data:", data)
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // const handleLogout = () => {
  //   localStorage.removeItem("token")
  //   setIsLoggedIn(false)
  //   // Optionally redirect to login page
  //   router.push("/login")
  // }

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  const handleLoginRedirect = () => {
    navigate("/");
  }

  const handleAddCategory = () => {
    if (!isLoggedIn) {
      alert("Please login to add a category")
      return
    }
    setOpenCategoryDialog(true)
  }

  const handleAddProblem = () => {
    if (!isLoggedIn) {
      alert("Please login to add a problem")
      return
    }
    setOpenProblemDialog(true)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          {isLoggedIn ? (
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleLogout} 
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLoginRedirect} 
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>


      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1, color: "black" }}>
            Be Coding App - Problems
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{ mr: 2 }}
            >
              Add Category
            </Button>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddProblem}>
              Add Problem
            </Button>
          </Box>
        </Box>

        {!isLoggedIn && (
          <Paper sx={{ p: 3, mb: 4, bgcolor: "#fff3e0", display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2, mr: 2 }}>
              Please login to create categories and problems.
            </Typography>
            <Button variant="contained" onClick={handleLoginRedirect} startIcon={<LoginIcon /> }>
              Go to Login
            </Button>
          </Paper>
        )}


        <CategoryList categories={categories} isLoggedIn={isLoggedIn} onCategoriesChange={setCategories} />
      </Container>

      <CategoryDialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        onAddCategory={(newCategory) => {
          setCategories([...categories, newCategory])
          setOpenCategoryDialog(false)
        }}
      />

      <ProblemDialog
        open={openProblemDialog}
        onClose={() => setOpenProblemDialog(false)}
        categories={categories}
        onAddProblem={(newProblem) => {
          // Update the categories with the new problem
          const updatedCategories = categories.map((category) => {
            if (category.id === newProblem.categoryId) {
              return {
                ...category,
                problems: [...(category.problems || []), newProblem],
              }
            }
            return category
          })
          setCategories(updatedCategories)
          setOpenProblemDialog(false)
        }}
      />
    </Box>
  )
}

export default ProblemsPage;
