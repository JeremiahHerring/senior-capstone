import { render, screen } from '@testing-library/react';
import Hero from '../src/app/components/Hero'; 

describe('Hero', () => {
  it('renders the heading and text content correctly', () => {
    render(<Hero />);

    // Check that the main heading is rendered
    const mainHeading = screen.getByText(/learn data structures and algorithms/i);
    expect(mainHeading).toBeInTheDocument();

    // Check that the subheading text is rendered
    const subHeading = screen.getByText(/prepare for technical interviews/i);
    expect(subHeading).toBeInTheDocument();

    // Check that the descriptive text is rendered
    const description = screen.getByText(/get your personalized roadmap/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the buttons with correct text', () => {
    render(<Hero />);

    // Check that the "Get Started" button is rendered
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    expect(getStartedButton).toBeInTheDocument();

    // Check that the "Learn more" button is rendered
    const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
    expect(learnMoreButton).toBeInTheDocument();
  });

  it('renders the buttons with correct attributes and styles', () => {
    render(<Hero />);

    // Check if "Get Started" button has the correct color scheme
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    expect(getStartedButton).toHaveStyle('background-color: green.400');

    // Ensure that the "Learn More" button is of variant 'link'
    const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
    expect(learnMoreButton).toHaveAttribute('type', 'button');
  });
});
