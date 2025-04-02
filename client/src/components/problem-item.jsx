"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { Badge } from "../components/ui/badge"
import { Edit, Book, ThumbsDown, ThumbsUp, Trash, Lightbulb } from "lucide-react"
import { deleteProblems, putProblems, addOrUpdateProblemToCategoryMap } from "../services/problemServce"
import ProblemDialog from "./problem-dialog"
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils"


export function ProblemItem({ problem, onEdit, isLoggedIn, categories, problemsByCategory, setProblemsByCategory }) {
  const [votes, setVotes] = useState(problem.voteCnt) 
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const navigate = useNavigate();


  const handleVote = (value) => {
    const newVotes = votes + value
    setVotes(newVotes)
    putProblems(problem.id, { "voteCnt":newVotes }); // No need to await here
  }


  // const handleVote = async (value) => {
  //   setVotes((prevVotes) => {
  //     const updatedVotes = prevVotes + value;
  //     putProblems(problem.id, { "voteCnt": updatedVotes }); // No need to await here
  //     // return updatedVotes;
  //   });
  // };

  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(problem)
    }
  }


  const handleEditProblemClick = (problem) => {
    if (!isLoggedIn) {
      alert("Please login to edit problem");
      return;
    }
  
    setSelectedProblem(problem)
    setEditDialogOpen(true)
  }


  const handleDeleteProblem = async (problemId, categoryId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) {
      return; // Exit if the user cancels the deletion
    }
  
    try {
      await deleteProblems(problemId);
  
      // Update state: remove deleted problem from the corresponding category
      setProblemsByCategory((prev) => {
        const updatedCategory = prev[categoryId]?.filter(
          (problem) => problem.id !== problemId
        ) || [];
  
        return { ...prev, [categoryId]: updatedCategory };
      });
  
    } catch (error) {
      console.error("Error deleting problem:", error.message);
      alert("Failed to delete problem. Please try again.");
    }
  }  


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
          href={problem.source || "https://leetcode.com/problems/random"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Book className="h-4 w-4 mr-1" />
          Source
        </a>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate(`/solutions/${problem.id}`)}
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
                onClick={() => handleDeleteProblem(problem.id, problem.categoryId)}
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

      {selectedProblem && (
        <ProblemDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          categories={categories}
          onChangeProblem={(newProblem) => {
            setProblemsByCategory((prev) => {
              const categoryProblems = [...(prev[newProblem.categoryId] || [])]
              const index = categoryProblems.findIndex((p) => p.id === newProblem.id)

              if (index !== -1) {
                categoryProblems[index] = newProblem
              } else {
                categoryProblems.push(newProblem)
              }

              return { ...prev, [newProblem.categoryId]: categoryProblems }
            })

            setEditDialogOpen(false)
          }}
          editProblem={problem}
        />
      )}
    </div>
  )
}

export default ProblemItem

