import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockSignup = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    signup: mockSignup,
    user: null,
    loading: false,
  }),
}));

describe("LoginPage Domain Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display error message when trying to submit with invalid email domain", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign in/i });

    // Submit invalid email format
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Please login with your college email ID (@learner.manipal.edu).")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should display error message for completely invalid email format", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Please enter a valid email/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should proceed to login when email is valid manipal domain", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: "student@learner.manipal.edu" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "student@learner.manipal.edu",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/discover");
    });
  });

  it("should support case-insensitive validation for manipal domain", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: "STUDENT@LEARNER.MANIPAL.EDU" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "STUDENT@LEARNER.MANIPAL.EDU",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/discover");
    });
  });
});
