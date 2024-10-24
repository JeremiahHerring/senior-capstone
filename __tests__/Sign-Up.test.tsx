import SignupCard from "@/app/sign-up/page";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignupCard", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });

    render(
      <ChakraProvider>
        <SignupCard />
      </ChakraProvider>,
    );
  });

  it("renders the heading", () => {
    const heading = screen.getByRole("heading", { name: /sign up/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the first name input", () => {
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toBeInTheDocument();
  });

  it("renders the last name input", () => {
    const lastNameInput = screen.getByLabelText(/last name/i);
    expect(lastNameInput).toBeInTheDocument();
  });

  it("renders the email input", () => {
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("renders the password input", () => {
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it("renders the sign up button", () => {
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
  });

  it("renders the login link", () => {
    const loginLink = screen.getByText(/already a user\?/i);
    expect(loginLink).toBeInTheDocument();
  });
});
