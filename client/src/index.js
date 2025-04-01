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
import HomePage from "./Pages/1-Home";
import ProblemsPage from "./Pages/2-Problems"
import SolutionsPage from "./Pages/3-Solutions";
import { AuthProvider } from "./services/security/AuthContext";
import RequireAuth from "./services/security/RequireAuth";
import "./styles/globals.css";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemsPage />} /> 
        {/* include :problemId to match the parameter correctly */}
        <Route path="/solutions/:problemId" element={<SolutionsPage />} />

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

