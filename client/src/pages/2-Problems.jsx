"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Plus, Lightbulb } from "lucide-react";
import CategoryDialog from "../components/category-dialog"
import ProblemDialog from "../components/problem-dialog"
import CategoryList from "../components/category-list"
import { useAuthUser } from "../services/security/AuthContext";
import { getProblemsByCategory, addOrUpdateProblemToCategoryMap } from "../services/problemService"
import LoginPrompt from "../components/login-prompt";


function ProblemsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [categories, setCategories] = useState([])
  const [problemsByCategory, setProblemsByCategory] = useState({});
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [openProblemDialog, setOpenProblemDialog] = useState(false)
  const { isAuthenticated, loading, user, login, register, logout } = useAuthUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
        // console.log("category data:", data)
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
                // console.log(problems);  // This will now log the actual problems
                setProblemsByCategory((prev) => ({ ...prev, [category.id]: problems }));
            }
        };
        fetchProblems();
    }
  }, [categories]);

  // console.log("problems page", problemsByCategory);

  const handleAddCategory = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return
    }
    setOpenCategoryDialog(true)
  }

  const handleAddProblem = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return
    }
    setOpenProblemDialog(true)
  }

  return (
    
    <div className="flex flex-col min-h-screen bg-white">
    {/* <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col relative"> */}

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
      
      <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

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

