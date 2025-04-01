// console.log("Database URL:", process.env.DATABASE_URL);

// ==== User APIs ====
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Middleware to verify JWT token sent by the client
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // attaching the user id to the request object, this will make it available in the endpoints that use this middleware
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/register", async (req, res) => {
  const {  email, password, username } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword },
    select: { id: true, email: true, username: true },
  });

  res.json(newUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // password: 123456 
  // user.password: $2b$10$naV1eAwirV13nyBYVS96W..52QzN8U/UQ7mmi/IEEVJDtCAdDmOl2
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // if email and password match, we create the payload and token 
  const payload = { userId: user.id };
  // encrypt the user.id object here
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  // instruct the client side to create a cookie with this value & options
  res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

  // ensure that the password is not sent to the client
  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  res.json(userData);
});


app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});


// requireAuth middleware will validate the access token sent by the client and will return the user information within req.auth
app.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, username: true },
  });
  res.json(user);
});



// ==== Problem APIs ====
// POST a new problem (requires authentication)
app.post("/problems", requireAuth, async (req, res) => {
  try {
    const { problemName, description, source, difficulty, voteCnt, createdById, categoryId } = req.body;
    const problem = await prisma.problem.create({
      data: {
        problemName : problemName,
        description : description,
        source : source,
        difficulty : difficulty,
        voteCnt : voteCnt,
        createdBy: { connect: { id: parseInt(createdById) } },
        category: { connect: { id: parseInt(categoryId) } },
      },
    });
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all problems
app.get('/problems', async (req, res) => {
  try {
      const problems = await prisma.problem.findMany({});
      res.json(problems);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Get problems by categoryID
app.get('/problems/category/:id', async (req, res) => {
  try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
          return res.status(400).json({ error: 'Invalid category ID' });
      }  
      const problem = await prisma.problem.findMany({
          where: { categoryId :  categoryId}
      });

      if (!problem) return res.status(404).json({ error: 'No problem found for this category' });
      res.json(problem);
  } catch (error) {
      console.error("Error fetching problems:", error);
      res.status(500).json({ error: error.message });
  }
});


// Update a problem
app.put('/problems/:id', requireAuth, async (req, res) => {
  try {
      const problemId = parseInt(req.params.id);
      if (isNaN(problemId)) {
          return res.status(400).json({ error: 'Invalid problem ID' });
      }

      // Fetch the existing problem
      const existingProblem = await prisma.problem.findUnique({
          where: { id: problemId }
      });

      if (!existingProblem) {
          return res.status(404).json({ error: 'Problem not found' });
      }

      // Merge updated fields with existing values
      const updatedProblem = await prisma.problem.update({
          where: { id: problemId },
          data: {
              problemName: req.body.problemName ?? existingProblem.problemName,
              description: req.body.description ?? existingProblem.description,
              source: req.body.source ?? existingProblem.source,
              difficulty: req.body.difficulty ?? existingProblem.difficulty,
              voteCnt : req.body.voteCnt ?? existingProblem.voteCnt,
              categoryId: req.body.categoryId ?? existingProblem.categoryId
          }
      });

      res.json(updatedProblem);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Delete a problem
app.delete('/problems/:id', requireAuth, async (req, res) => {
  try {
      await prisma.problem.delete({ where: { id: parseInt(req.params.id) } });
      res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});



// ==== Category APIs ====
app.post('/categories', requireAuth, async (req, res) => {
  try {
      const { categoryName } = req.body;
      const category = await prisma.category.create({
          data: { categoryName }
      });
      res.status(201).json(category);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


// Get all categories
app.get('/categories', async (req, res) => {
  try {
      const categories = await prisma.category.findMany({
        orderBy: { categoryName: "asc" }
      });
      res.status(201).json(categories);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Get a single category by ID
app.get('/categories/:id', async (req, res) => {
  try {
      const category = await prisma.category.findUnique({
          where: { id: parseInt(req.params.id) }
      });
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Update a category
app.put('/categories/:id', requireAuth, async (req, res) => {
  try {
      const { categoryName } = req.body;
      const category = await prisma.category.update({
          where: { id: parseInt(req.params.id) },
          data: { categoryName : categoryName }
      });
      res.json(category);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Delete a category
app.delete('/categories/:id', requireAuth, async (req, res) => {
  try {
      await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
      res.json({ message: 'Category deleted successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});



// ==== Problem APIs ====
// Create a new solution
app.post('/solutions', requireAuth, async (req, res) => {
  try {
      const { problemId, userId, solutionName, codeSnippet, timeComplexity, spaceComplexity } = req.body;
      const solution = await prisma.solution.create({
          data: {
              problemId,
              userId,
              solutionName,
              codeSnippet,
              timeComplexity,
              spaceComplexity
          }
      });
      res.status(201).json(solution);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Get solutions by problem ID
app.get('/solutions/problem/:problemId', requireAuth, async (req, res) => {
  try {
      const { problemId } = req.params;
      const solutions = await prisma.solution.findMany({
          where: { problemId: parseInt(problemId) }
      });
      res.json(solutions);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Update a solution by ID
app.put('/solutions/:id', requireAuth, async (req, res) => {
  try {
      const solutionId = parseInt(req.params.id);
      if (isNaN(solutionId)) {
          return res.status(400).json({ error: 'Invalid solution ID' });
      }

      // Fetch the existing solution
      const existingSolution = await prisma.solution.findUnique({
          where: { id: solutionId }
      });

      if (!existingSolution) {
          return res.status(404).json({ error: 'Solution not found' });
      }

      // Merge updated fields with existing values
      const updatedSolution = await prisma.solution.update({
          where: { id: solutionId },
          data: {
              solutionName: req.body.solutionName ?? existingSolution.solutionName,
              codeSnippet: req.body.codeSnippet ?? existingSolution.codeSnippet,
              timeComplexity: req.body.timeComplexity ?? existingSolution.timeComplexity,
              spaceComplexity: req.body.spaceComplexity ?? existingSolution.spaceComplexity
          }
      });

      res.json(updatedSolution);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a solution by ID
app.delete('/solutions/:id', requireAuth, async (req, res) => {
  try {
      const { id } = req.params;
      await prisma.solution.delete({
          where: { id: parseInt(id) }
      });
      res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});




app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});




// Prisma Commands
// npx prisma db push: to push the schema to the database or any changes to the schema
// npx prisma studio: to open prisma studio and visualize the database
