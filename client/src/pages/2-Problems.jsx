"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card" 
import { Plus, LogIn, LogOut, Code } from "lucide-react";
import CategoryDialog from "../components/category-dialog"
import ProblemDialog from "../components/problem-dialog"
import CategoryList from "../components/category-list"
import { useAuthUser } from "../services/security/AuthContext";
import { useNavigate } from "react-router-dom"; 
import { getProblemsByCategory, addOrUpdateProblemToCategoryMap } from "../services/problemServce"


function ProblemsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [categories, setCategories] = useState([])
  const [problemsByCategory, setProblemsByCategory] = useState({});
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [openProblemDialog, setOpenProblemDialog] = useState(false)
  const { isAuthenticated, loading, user, login, register, logout } = useAuthUser();
  const navigate = useNavigate();

  // Check if user is logged in
//   The empty dependency array [] means the effect runs only once when the component mounts.

// If isAuthenticated updates later, setIsLoggedIn(isAuthenticated); won’t run again, so the component might not reflect the latest auth state.
  // useEffect(() => {
  //   // This would be replaced with your actual auth check
  //   const checkAuth = () => {
  //     setIsLoggedIn(isAuthenticated)
  //   }

  //   checkAuth()
  // }, [])

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);
  

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

  // Effect to load problems for each category when categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
        // Use an async function to handle the async fetch within useEffect
        const fetchProblems = async () => {
            for (const category of categories) {
                const problems = await getProblemsByCategory(category.id);
                console.log(problems);  // This will now log the actual problems
                setProblemsByCategory((prev) => ({ ...prev, [category.id]: problems }));
            }
        };
        fetchProblems();
    }
  }, [categories]);

  console.log("problems page", problemsByCategory);


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
    
    <div className="flex flex-col min-h-screen bg-white">
    {/* <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col relative"> */}
      {/* <header className="bg-blue-50 shadow-sm sticky top-0 z-10"> */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-black" />
            <h2 className="text-xl font-medium">BeCoding 🐭🐱🚀</h2>
          </div>
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button onClick={handleLoginRedirect} className="material-btn-primary px-4 py-2">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-6 md:mb-0">Coding Problems</h1>
          <div className="flex gap-2">
            <Button onClick={handleAddCategory} className="material-btn-primary font-bold px-4 py-2">
              <Plus className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button onClick={handleAddProblem} className="material-btn-secondary font-bold px-4 py-2">
              <Plus className="h-4 w-4 mr-2" />
              Problem
            </Button>
          </div>
        </div>

        <CategoryList
          categories={categories}
          isLoggedIn={isLoggedIn}
          setCategories={setCategories}
          problemsByCategory={problemsByCategory}
          setProblemsByCategory={setProblemsByCategory}
        />
      </main>
      

      {/* categoryDialogOpen, setCategoryDialogOpen, categories, setCategories, isEdit = false, changeCategory = null */}
      <CategoryDialog
        categoryDialogOpen={openCategoryDialog}
        setCategoryDialogOpen={setOpenCategoryDialog}
        categories={categories}
        setCategories={setCategories}
      />


      {/* ProblemDialog({ open, onClose, categories, onChangeProblem, editProblem=null}) */}
      <ProblemDialog
        open={openProblemDialog}
        onClose={() => setOpenProblemDialog(false)}
        categories={categories}
        onChangeProblem={(newProblem) => 
          addOrUpdateProblemToCategoryMap(newProblem, problemsByCategory, setProblemsByCategory, setOpenProblemDialog)
        }
      />
    </div>
  )
}

export default ProblemsPage;

