"use client"

import {
  TableCell,
  TableRow,
  IconButton,
  Chip,
  Link,
  ListItem,
  Grid,
  Typography
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects"



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

export function ProblemItem({ problem }) {
  return (
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
            href="https://leetcode.com/problems/random"
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
        <Grid item xs={2.4} sx={{ textAlign: "center" }}>
          <IconButton size="small" color="primary">
            <ThumbUpIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </StyledListItem>
  )
}

export default ProblemItem

