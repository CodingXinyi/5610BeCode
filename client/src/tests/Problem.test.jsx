import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProblemsPage from "../pages/2-Problems";
import { useAuthUser } from "../services/security/AuthContext";
import * as problemService from "../services/problemService";

// Mock AuthContext
jest.mock("../services/security/AuthContext");

// Mock problem service
// jest.mock("../services/problemService", () => ({
//   getProblemsByCategory: jest.fn(),
//   addOrUpdateProblemToCategoryMap: jest.fn(),
// }));

// Mock fetch for categories
// global.fetch = jest.fn();

describe("ProblemsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ignore warning 
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (message.includes('React Router Future Flag Warning')) return;
      console.warn(message);
    });
  });

  const mockCategories = [
    { id: 1, name: "Array", createdAt: "2023-01-01" },
    { id: 2, name: "String", createdAt: "2023-01-02" }
  ];


  test("renders page title", () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });

    render(
      <MemoryRouter>
        <ProblemsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Coding Problems/i)).toBeInTheDocument();
  });


  test("shows login prompt when clicking 'Category' while logged out", () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });

    render(
      <MemoryRouter>
        <ProblemsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Category/i));
    expect(screen.getByText(/Please log in to explore more!/i)).toBeInTheDocument();
  });



  test("opens Category dialog when logged in", async () => {
    useAuthUser.mockReturnValue({   isAuthenticated: true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });


    render(
      <MemoryRouter>
        <ProblemsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Category/i }));
    await waitFor(() => {
      expect(screen.getByText(/Add Category/i)).toBeInTheDocument();
    });
  });


  test("opens Problem dialog when logged in", async () => {
    useAuthUser.mockReturnValue({   isAuthenticated: true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });


    render(
      <MemoryRouter>
        <ProblemsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Problem/i }));
    await waitFor(() => {
      expect(screen.getByText(/Add Problem/i)).toBeInTheDocument();
    });
  });

});
