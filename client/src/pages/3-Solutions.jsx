
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

import { SolutionsList } from "../components/solution-list"
import { Button } from "../components/ui/button"
import { getAllProblems } from "../services/problemService"
import { useParams } from "react-router-dom"; // Import useParams
import { useAuthUser } from "../services/security/AuthContext";
import { getLeetCodeProblemData } from "../services/leetcodeService"
import { Link } from "react-router-dom";


export default function SolutionsPage() {
  const { problemId } = useParams(); // Get problemId from URL params
  const [problem, setProblem] = useState(null);
  const { isAuthenticated, user } = useAuthUser();
  const [leetcodeProblemDescription, setLeetcodeProblemDescription] = useState(null);
  
  const toKebabCase = (str) => {
    return str && str.toLowerCase().replace(/\s+/g, "-");
  };

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };  
  

  useEffect(() => {
    const getProblem = async () => {
      const problems = await getAllProblems();
      const foundProblem = problems.find((p) => p.id === Number(problemId)); // Convert problemId to number
      // console.log("3-solution page: problems", problems, "foundProblem", foundProblem, "params", problemId);
      setProblem(foundProblem);
    };

    getProblem();
  }, [problemId]);


  useEffect(() => {
    const fetchProblemData = async () => {
      if (!problemId || !problem) return;

      try {
        const kebabName = toKebabCase(problem.problemName);
        const data = await getLeetCodeProblemData(kebabName);

        setLeetcodeProblemDescription(data.description);
      } catch (error) {
        console.error("Error fetching leetcode problem description data:", error);
      }
    };

    fetchProblemData();
  }, [problem]);

  if (!problem || !user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Problem not found or user not logged in</h1>
        <a href="/problems">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to problems
          </Button>
        </a>
      </div>
    );
  }
  


  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/problems">
        <Button variant="outline" className="flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to problems
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{problem.problemName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
          <div>Difficulty: {problem.difficulty}</div>
          <div>Created At: {new Date(problem.createdAt).toLocaleString()}</div>
          
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
          {/* <p>{problem.description}</p> */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: decodeHtml(leetcodeProblemDescription) }}
          />
        </div>
      </div>

      <SolutionsList problemId={problemId} />
    </div>
  )
}

