import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/1-Home";
import { useAuthUser } from "../services/security/AuthContext";

// Mock navigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock AuthContext
jest.mock("../services/security/AuthContext");


describe("HomePage", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  // ignore warning 
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (message.includes('React Router Future Flag Warning')) return;
      console.warn(message);
    });
  });

  test("renders welcome text", () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Start Your Adventure!/i)).toBeInTheDocument();
  });

  test("opens login dialog when Sign In clicked", () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });


  test("opens register dialog when Create Account clicked", () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });
    
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Create Account/i));
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
  });


  test("displays animated code snippet", () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/function pickSnacks/i)).toBeInTheDocument();
  });


  test("can input email and password", async () => {
    useAuthUser.mockReturnValue({   isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      user: null, });
    
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Sign In/i));

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });
});
