"use client"

import { useState } from "react"
import {
  Box,
  IconButton,
  Chip,
  Link,
  ListItem,
  Grid,
  Typography, 
  Tooltip
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { deleteProblems, putProblems, addOrUpdateProblemToCategoryMap } from "../services/problemsServce"
import ProblemDialog from "./problem-dialog"



const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}))


const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "success"
    case "medium":
      return "warning"
    case "hard":
      return "error"
    default:
      return "default"
  }
}

export function ProblemItem({ problem, onEdit, onVote, isLoggedIn, categories, problemsByCategory, setProblemsByCategory }) {
  const [votes, setVotes] = useState(problem.votes || 0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)

  const handleVote = (value) => {
    const newVotes = votes + value
    setVotes(newVotes)
    if (onVote) {
      onVote(problem.id, newVotes)
    }
  }

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



  return (
    <Box>
      <StyledListItem disablePadding>
        <Grid container alignItems="center">
          <Grid item xs={2.4}>
            <Typography variant="body2">{problem.problemName}</Typography>
          </Grid>
          <Grid item xs={2.4} sx={{ textAlign: "center" }}>
            <Chip label={problem.difficulty} color={getDifficultyColor(problem.difficulty)} size="small" />
          </Grid>
          <Grid item xs={2.4} sx={{ textAlign: "center" }}>
            <Link
              href={problem.source || "https://leetcode.com/problems/random"}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <MenuBookIcon fontSize="small" sx={{ mr: 0.5 }} />
              Source
            </Link>
          </Grid>
          <Grid item xs={2.4} sx={{ textAlign: "center" }}>
            <Link
              href="https://solutions.com/random"
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "green" }}
            >
              <EmojiObjectsIcon fontSize="small" sx={{ mr: 0.5 }} />
              Solution
            </Link>
          </Grid>
          <Grid item xs={2.4} sx={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 1 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Downvote">
                <span>
                  <IconButton 
                    size="small" 
                    color="default" 
                    onClick={() => handleVote(-1)}
                    disabled={!isLoggedIn}
                  >
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Typography variant="body2" sx={{ mx: 0.5 }}>
                {votes}
              </Typography>
              <Tooltip title="Upvote">
                <span>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => handleVote(1)}
                    disabled={!isLoggedIn}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
            <Tooltip title="Update problem">
              <span>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={(e) => handleEditProblemClick(problem)}
                  disabled={!isLoggedIn}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete problem">
              <span>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteProblem(problem.id, problem.categoryId)} // Pass problem.id
                  disabled={!isLoggedIn}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </StyledListItem>

      {/* Edit Problem Dialog */}
      {selectedProblem && (
        <ProblemDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          categories={categories}
          onChangeProblem={(newProblem) => 
            addOrUpdateProblemToCategoryMap(newProblem, problemsByCategory, setProblemsByCategory, setEditDialogOpen)
          }
          editProblem={problem}
        />
      )}
    </Box>
  )
}

export default ProblemItem

