import { render, screen } from "@testing-library/react";
import SignupCard from "@/app/sign-up/page"; // Adjust the path as needed
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SignupCard", () => {
  beforeEach(() => {
    // Mock the router implementation
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
      pathname: "/sign-up", // you can adjust the pathname as needed
      query: {},
      asPath: "/sign-up", // adjust as necessary
    }));
    
    // Render the SignupCard directly
    render(<SignupCard />);
  });

  it("renders signup form", () => {
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
  });

  // Additional tests...
});
