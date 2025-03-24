import { useState } from "react";
import { useAuthUser } from "../services/security/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from "@mui/material";

export default function Home() {
  const { login, register } = useAuthUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

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
    e.preventDefault();
    if (isLogin) {
        // if we do not check success or not, it'll always route to problems
        const success = await login(email, password);
        if (success) {
            navigate("/problems");
        } else {
            console.log("Login failed");
            alert("Invalid Email or Password, please try again!");          
        }
    } else {
        await register(email, password, name); 
        alert("Account created! Please log in.");
        navigate("/");
    }
    handleClose();
  };

  return (
    <Box textAlign="center" p={4}>
      <Typography variant="h3" gutterBottom>
        Be Coding App
      </Typography>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/problems")}>
          Enter App as Guest
        </Button>
      </Box>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen(true)}>
          Login
        </Button>
      </Box>
      <Box mt={2}>
        <Button variant="outlined" color="secondary" onClick={() => handleOpen(false)}>
          Create Account
        </Button>
      </Box>

      {/* Dialog for Login/Register */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
        <DialogContent>
          {!isLogin && (
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
