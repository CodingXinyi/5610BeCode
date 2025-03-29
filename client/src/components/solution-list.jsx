
"use client"

import { useState, useEffect } from "react";
import { Copy, Edit, Trash2, Plus } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { getSolutionsByProblemId } from "../services/solutionService"

export function SolutionsList({ problemId }) {
  const [copiedId, setCopiedId] = useState(null)
  const [solutions, setSolutions] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSolution, setCurrentSolution] = useState(null)
  const [formData, setFormData] = useState({
    solutionName: "",
    codeSnippet: "",
    timeComplexity: "",
    spaceComplexity: "",
    authorName: "",
  })

  // Filter solutions for this problem
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const fetchedSolutions = await getSolutionsByProblemId(problemId);
        setSolutions(fetchedSolutions);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    if (problemId) {
      fetchSolutions();
    }
  }, [problemId]);


  const handleCopyCode = (solutionId, code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(solutionId)

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSolution = (e) => {
    e.preventDefault()

    const newSolution = {
      solutionName: formData.solutionName,
      codeSnippet: formData.codeSnippet,
      timeComplexity: formData.timeComplexity,
      spaceComplexity: formData.spaceComplexity,
    }

    // we need to add theis using api!!!!
    setSolutions((prev) => [...prev, newSolution])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditClick = (solution) => {
    setCurrentSolution(solution)
    setFormData({
      solutionName: solution.solutionName,
      codeSnippet: solution.codeSnippet,
      timeComplexity: solution.timeComplexity || "",
      spaceComplexity: solution.spaceComplexity || "",
      authorName: solution.authorName || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSolution = (e) => {
    e.preventDefault()

    // we need to update theis using api!!!!
    setSolutions((prev) =>
      prev.map((solution) =>
        solution.id === currentSolution.id
          ? {
              ...solution,
              solutionName: formData.solutionName,
              codeSnippet: formData.codeSnippet,
              timeComplexity: formData.timeComplexity,
              spaceComplexity: formData.spaceComplexity,
              authorName: formData.authorName || "Anonymous",
            }
          : solution,
      ),
    )

    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteSolution = (solutionId) => {
    // we need to update theis using api!!!!
    setSolutions((prev) => prev.filter((solution) => solution.id !== solutionId))
  }

  const resetForm = () => {
    setFormData({
      solutionName: "",
      codeSnippet: "",
      timeComplexity: "",
      spaceComplexity: "",
      authorName: "",
    })
    setCurrentSolution(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Solutions</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Solution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleAddSolution}>
              <DialogHeader>
                <DialogTitle>Add New Solution</DialogTitle>
                <DialogDescription>Share your solution to help others learn.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="solutionName">Solution Name</Label>
                  <Input
                    id="solutionName"
                    name="solutionName"
                    value={formData.solutionName}
                    onChange={handleInputChange}
                    placeholder="e.g., Optimized Dynamic Programming Approach"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="codeSnippet">Code Snippet</Label>
                  <Textarea
                    id="codeSnippet"
                    name="codeSnippet"
                    value={formData.codeSnippet}
                    onChange={handleInputChange}
                    placeholder="Paste your code here..."
                    className="min-h-[200px] font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="timeComplexity">Time Complexity</Label>
                    <Input
                      id="timeComplexity"
                      name="timeComplexity"
                      value={formData.timeComplexity}
                      onChange={handleInputChange}
                      placeholder="e.g., O(n)"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="spaceComplexity">Space Complexity</Label>
                    <Input
                      id="spaceComplexity"
                      name="spaceComplexity"
                      value={formData.spaceComplexity}
                      onChange={handleInputChange}
                      placeholder="e.g., O(n)"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="authorName">Your Name</Label>
                  <Input
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="Anonymous"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Solution</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleUpdateSolution}>
              <DialogHeader>
                <DialogTitle>Edit Solution</DialogTitle>
                <DialogDescription>Update your solution details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-solutionName">Solution Name</Label>
                  <Input
                    id="edit-solutionName"
                    name="solutionName"
                    value={formData.solutionName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-codeSnippet">Code Snippet</Label>
                  <Textarea
                    id="edit-codeSnippet"
                    name="codeSnippet"
                    value={formData.codeSnippet}
                    onChange={handleInputChange}
                    className="min-h-[200px] font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-timeComplexity">Time Complexity</Label>
                    <Input
                      id="edit-timeComplexity"
                      name="timeComplexity"
                      value={formData.timeComplexity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-spaceComplexity">Space Complexity</Label>
                    <Input
                      id="edit-spaceComplexity"
                      name="spaceComplexity"
                      value={formData.spaceComplexity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-authorName">Your Name</Label>
                  <Input
                    id="edit-authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Solution</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {solutions.length === 0 ? (
        <div className="text-center py-8 text-
        ">
          No solutions available for this problem yet. Be the first to add one!
        </div>
      ) : (
        <div className="grid gap-6">
          {solutions.map((solution) => (
            <Card key={solution.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{solution.solutionName}</CardTitle>
                    <CardDescription>
                      <div className="flex gap-4 text-sm">
                        <div>Time Complexity: {solution.timeComplexity || "Not specified"}</div>
                        <div>Space Complexity: {solution.spaceComplexity || "Not specified"}</div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(solution)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit solution</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete solution</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Solution</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this solution? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSolution(solution.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{solution.codeSnippet}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyCode(solution.id, solution.codeSnippet)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy code</span>
                  </Button>
                  {copiedId === solution.id && (
                    <div className="absolute top-2 right-12 bg-background text-sm py-1 px-2 rounded shadow">
                      Copied!
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">Added by: {solution.authorName || "Anonymous"}</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

