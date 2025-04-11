"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog"
import { Edit, Book, Link, ExternalLink, ThumbsDown, ThumbsUp, Trash, Lightbulb } from "lucide-react"
import { deleteProblems, putProblems, addOrUpdateProblemToCategoryMap } from "../services/problemService"
import ProblemDialog from "./problem-dialog"
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils"
import LoginPrompt from "./login-prompt"


export function ProblemItem({ problem, isLoggedIn, categories, setProblemsByCategory }) {
  const [votes, setVotes] = useState(problem.voteCnt) 
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [deleteProblemDialogOpen, setDeleteProblemDialogOpen] = useState(false)
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleVote = (value) => {
    const newVotes = votes + value
    setVotes(newVotes)
    putProblems(problem.id, { "voteCnt":newVotes }); // No need to await here
  }


  const handleSolutionClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      navigate(`/solutions/${problem.id}`);
    }
  };


  const handleEditProblemClick = (problem) => {
    if (!isLoggedIn) {
      alert("Please login to edit problem");
      return;
    }
  
    setSelectedProblem(problem)
    setEditDialogOpen(true)
  }


  const openDeleteDialog = (problem) => {
    setProblemToDelete(problem);
    setDeleteProblemDialogOpen(true);
  };
  
  const confirmDeleteProblem = async () => {
    if (!problemToDelete) return;
  
    setLoading(true);
    try {
      await deleteProblems(problemToDelete.id);
  
      setProblemsByCategory((prev) => {
        const updated = (prev[problemToDelete.categoryId] || []).filter(
          (p) => p.id !== problemToDelete.id
        );
        return { ...prev, [problemToDelete.categoryId]: updated };
      });
  
      setDeleteProblemDialogOpen(false);
      setProblemToDelete(null);
    } catch (error) {
      console.error("Error deleting problem:", error.message);
      alert("Failed to delete problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500 hover:bg-green-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "hard":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  
  return (
    <div className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-muted/50 transition-colors">
      <div className="text-sm font-medium truncate">{problem.problemName}</div>

      <div className="flex justify-center">
        <Badge className={cn("font-medium", getDifficultyColor(problem.difficulty))}>{problem.difficulty}</Badge>
      </div>

      <div className="flex justify-center">
        <a
          href={problem.source || "https://leetcode.com/problems"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Leetcode
        </a>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSolutionClick}
          className="flex items-center text-green-600 hover:text-green-800"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Solution
        </button>
      </div>

      <div className="flex justify-center items-center gap-2">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleVote(1)}
                  disabled={!isLoggedIn}
                  className="h-8 w-8 text-primary"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upvote</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="mx-1 text-xs font-medium">{votes}</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleVote(-1)}
                  disabled={!isLoggedIn}
                  className="h-8 w-8"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Downvote</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditProblemClick(problem)}
                disabled={!isLoggedIn}
                className="h-8 w-8 text-primary"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDeleteDialog(problem)}
                disabled={!isLoggedIn}
                className="h-8 w-8 text-primary"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-sm mx-4 p-6 rounded-2xl shadow-xl text-center">
            <p className="text-lg font-medium mb-6">Please log in to view the solution! 😎 </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition duration-150"
                onClick={() => {
                  navigate("/home"); // Redirect to login page
                  setShowLoginPrompt(false);
                }}
              >
                Login
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-xl transition duration-150"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteProblemDialogOpen} onOpenChange={setDeleteProblemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Problem</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{problemToDelete?.problemName}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteProblemDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProblem} disabled={loading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default ProblemItem

