// import ReactDOM from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';

import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AppLayout from "./components/AppLayout";
// import Todos from "./components/Todos";
// import TodoDetail from "./components/TodoDetail";
// import Profile from "./components/Profile";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import NotFound from "./components/NotFound";
// import Home from "./components/Home";
import Home from "./pages/Home"
import ProblemsList from "./pages/Problems"
import { AuthProvider } from "./services/security/AuthContext";
import RequireAuth from "./services/security/RequireAuth";
import "./style/ProblemsList.css";
import "./style/index.css";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<ProblemsList />} />


        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app/*"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Profile />} />
          <Route path="todos" element={<Todos />} />
          <Route path="todos/:todoId" element={<TodoDetail />} />
        </Route> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

