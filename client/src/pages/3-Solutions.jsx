
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

import { SolutionsList } from "../components/solution-list"
import { Button } from "../components/ui/button"
import { getAllProblems } from "../services/problemServce"
import { useParams } from "react-router-dom"; // Import useParams


export default function SolutionsPage() {
  const { problemId } = useParams(); // Get problemId from URL params
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const getProblem = async () => {
      const problems = await getAllProblems();
      const foundProblem = problems.find((p) => p.id === Number(problemId)); // Convert problemId to number
      console.log("3-solution page: problems", problems, "foundProblem", foundProblem, "params", problemId);
      setProblem(foundProblem);
    };

    getProblem();
  }, [problemId]);


  if (!problem) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Problem not found</h1>
        <a href="/problems">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to problems
          </Button>
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <a href="/problems">
        <Button variant="outline" className="flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to problems
        </Button>
      </a>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{problem.problemName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div>Difficulty: {problem.difficulty}</div>
          <div>Category: {problem.category}</div>
          {problem.source && (
            <a
              href={problem.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View original problem
            </a>
          )}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Problem Description:</h2>
          <p>{problem.description}</p>
        </div>
      </div>

      <SolutionsList problemId={problemId} />
    </div>
  )
}

