import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useAuthUser } from "../services/security/AuthContext";
import { postProblems, putProblems } from "../services/problemService";
import { getLeetCodeProblemData } from "../services/leetcodeService";


export default function ProblemDialog({
  open,
  onClose,
  categories,
  onChangeProblem,
  editProblem = null,
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAuthenticated, user } = useAuthUser();
  const [formData, setFormData] = useState({
    problemName: "",
    description: "",
    source: "",
    difficulty: "",
    voteCnt: 0,
    createdById: null,
    categoryId: "",
  });

  
  // Set form data when editing a problem
  useEffect(() => {
    if (editProblem) {
      setFormData({
        problemName: editProblem.problemName || "",
        description: editProblem.description || "",
        source: editProblem.source || "",
        difficulty: editProblem.difficulty || "",
        categoryId: editProblem.categoryId || "",
        votes: editProblem.votes || 0,
      });
    } else {
      // Reset form when not in edit mode
      if (isAuthenticated && user?.id) {
        setFormData({
          ...formData,
          createdById: user.id,
        });
      }
    }
  }, [editProblem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Fetch problem details from LeetCode API when problemName changes
  useEffect(() => {
    const fetchProblemData = async () => {
      if (!formData.problemName) return;

      try {
        const kebabName = formData.problemName.toLowerCase().replace(/\s+/g, "-");
        const data = await getLeetCodeProblemData(kebabName);

        // Set the fetched description, difficulty, and source
        setFormData((prevData) => ({
          ...prevData,
          description: data.description || "",
          source: data.link || "", // Assuming source is the problem link
          difficulty: data.difficulty || "",
        }));
      } catch (error) {
        console.error("Error fetching LeetCode problem description data:", error);
      }
    };

    fetchProblemData();
  }, [formData.problemName]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.problemName.trim()) {
      newErrors.problemName = "Problem name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }

    if (!formData.difficulty) {
      newErrors.difficulty = "Difficulty is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function for handleSubmit
  async function insertOrUpdateProblem(problemData) {
    try {
      let data;
      if (editProblem) {
        data = await putProblems(editProblem.id, problemData);
      } else {
        data = await postProblems(problemData);
      }

      if (data && data.id) {
        return data;
      } else {
        throw new Error(`Failed to create problem: ${data.error || "Invalid response"}`);
      }
    } catch (error) {
      console.error("Error in insertOrUpdateProblem:", error);
      throw new Error("Failed to create problem");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const newProblem = await insertOrUpdateProblem(formData);
      onChangeProblem(newProblem);
      resetForm();
    } catch (error) {
      console.error("Error creating problem:", error);
      setErrors({
        ...errors,
        form: "Failed to create problem. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      problemName: "",
      description: "",
      source: "",
      difficulty: "",
      voteCnt: 0,
      createdById: user.id,
      categoryId: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!editProblem) {
      resetForm();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
          <DialogDescription>Fill out the details to add a new problem.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="problemName">Problem Name</Label>
            <Input
              id="problemName"
              name="problemName"
              value={formData.problemName}
              onChange={handleChange}
              disabled={loading}
              required
            />
            {errors.problemName && <p className="text-sm text-red-500">{errors.problemName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="source">LeetCode Link</Label>
              <Input
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                id="source"
                name="source"
                value={formData.difficulty}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
          </div>

          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 animate-spin border-2 border-t-transparent border-white rounded-full" />
              ) : (
                "Add Problem"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
