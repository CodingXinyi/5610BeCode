"use client"

import { useState, useEffect } from "react";
import { useAuthUser } from "../services/security/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Code, ChevronRight, Terminal, Database, Server, Cpu, Layers } from "lucide-react";
import { Star, Sparkles, Heart, Rocket, Zap, Gift, Crown } from "lucide-react"


// Animated code snippet component
const AnimatedCodeSnippet = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const codeLines = [
    "function solve(array) {",
    "  const result = [];",
    "  for (let i = 0; i < array.length; i++) {",
    "    if (array[i] % 2 === 0) {",
    "      result.push(array[i]);",
    "    }",
    "  }",
    "  return result;",
    "}",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % (codeLines.length + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black rounded-lg p-4 text-green-400 font-mono text-sm shadow-lg max-w-md w-full mx-auto">
      <div className="flex items-center mb-2 text-xs">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-400">code.js</span>
      </div>
      <div className="space-y-1">
        {codeLines.map((line, index) => (
          <div key={index} className={`transition-opacity duration-300 ${index <= currentLine ? "opacity-100" : "opacity-0"}`}>
            <span className="text-gray-500 mr-2">{index + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


// Bouncing character component
const BouncingCharacter = ({ emoji, delay, position }) => {
  return (
    <div
      className={`absolute text-4xl animate-bounce-custom`}
      style={{
        animationDelay: `${delay}s`,
        top: position.top,
        left: position.left,
        zIndex: 10,
      }}
    >
      {emoji}
    </div>
  )
}


export default function HomePage() {
  const { login, register } = useAuthUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false)

  const handleOpen = (loginMode) => {
    setIsLogin(loginMode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        const success = await login(email, password)
        if (success) {
          setShowConfetti(true)
          setTimeout(() => {
            navigate("/problems")
          }, 1500)
        } else {
          setError("Oops! Email or password doesn't match. Try again! 🔄")
        }
      } else {
        await register(name, email, password)
        setOpen(false)
        // Show success message
        alert("Yay! Your account is created! 🎉 Please log in to continue.")
      }
    } catch (error) {
      console.error("Auth error:", error)
      setError(isLogin ? "Login hiccup! Let's try again. 🙈" : "Signup hiccup! Let's try again. 🙈")
    } finally {
      setLoading(false)
    }
  }

  // Characters for the bouncing animation
  const characters = [
    { emoji: "🚀", delay: 0, position: { top: "20%", left: "33%" } },
    { emoji: "💻", delay: 0.5, position: { top: "25%", left: "85%" } },
    { emoji: "🎮", delay: 1, position: { top: "70%", left: "15%" } },
    { emoji: "🧩", delay: 1.5, position: { top: "60%", left: "80%" } },
    { emoji: "⭐", delay: 2, position: { top: "40%", left: "5%" } },
  ]

  return (
    // <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col relative">    
    <div className="min-h-screen bg-white flex flex-col relative">      

      {/* Bouncing characters */}
      {characters.map((char, index) => (
        <BouncingCharacter key={index} emoji={char.emoji} delay={char.delay} position={char.position} />
      ))}

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-black" />
            <h2 className="text-xl font-medium">BeCoding 🐭🐱🚀</h2>
          </div>
        </div>
      </header>

      {/* Confetti effect when logging in */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="confetti-container">
            {Array(50)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"][
                      Math.floor(Math.random() * 6)
                    ],
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
          </div>
        </div>
      )}


      {/* <main className="flex-1 relative z-10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Master Coding Challenges with Ease</h1>
          <p className="text-lg text-muted-foreground mb-8">Organize, track, and solve coding problems to improve your skills and prepare for technical interviews.</p>
          <AnimatedCodeSnippet />
          <div className="flex justify-center gap-4 mt-6">
            <Button size="lg" onClick={() => navigate("/problems")}>Get Started as Guest</Button>
            <Button variant="outline" size="lg" onClick={() => handleOpen(true)}>Sign In</Button>
            <Button variant="outline" size="lg" onClick={() => handleOpen(false)}>Create Account</Button>
          </div>
        </div>
      </main> */}


      <main className="flex-1 relative z-10">
        {/* Hero section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-bounce-text">
                  <span className="text-green-500">Welcome</span> to <span className="text-yellow-500">Be</span>
                  <span className="text-red-500">Coding</span>!
                </h1>
                <p className="text-xl text-gray-600 animate-fade-in animation-delay-200">
                  Learn coding through playful challenges and level up your skills! 
                </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in animation-delay-300">
              <Button
                variant="outline"
                size="lg"
                className="rounded border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                onClick={() => navigate("/problems")}
              >
                Start Your Adventure!
                <Sparkles className="ml-2 h-5 w-5 animate-pulse" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in animation-delay-300">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleOpen(true)}
                className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <Heart className="mr-2 h-4 w-4" /> Sign In
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleOpen(false)}
                className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <Heart className="mr-2 h-4 w-4" /> Create Account
              </Button>
            </div>
            </div>

              <div className="md:w-1/2 animate-fade-in animation-delay-400">
                <div className="relative">
                  {/* <div className="absolute -inset-4 bg-gradient-to-r from-pink-300 to-purple-300 rounded-3xl blur-lg opacity-30 animate-pulse"></div> */}
                  <AnimatedCodeSnippet />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Login" : "Create Account"}</DialogTitle>
            <DialogDescription>
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in the details below to create a new account"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* {error && <div className="text-sm font-medium text-destructive">{error}</div>} */}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isLogin ? "Login" : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 BeCoding. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
