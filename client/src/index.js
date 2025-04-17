// import ReactDOM from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';

import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/4-NotFound";
import HomePage from "./pages/1-Home";
import ProblemsPage from "./pages/2-Problems"
import SolutionsPage from "./pages/3-Solutions";
import AppLayout from "./pages/0-AppLayout";
import { AuthProvider } from "./services/security/AuthContext";
import "./styles/globals.css";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/problems" element={<ProblemsPage />} /> 
          <Route path="/solutions/:problemId" element={<SolutionsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

