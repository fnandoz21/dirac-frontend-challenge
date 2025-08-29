import { render, screen } from '@testing-library/react';
import App from './App';

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => {
  return {
    Canvas: ({ children }: any) => <div data-testid="mock-canvas">{children}</div>
  };
});
  
// Mock @react-three/drei controls/grid (optional)
vi.mock('@react-three/drei', () => {
  return {
    OrbitControls: () => <div data-testid="mock-orbit-controls" />,
    Grid: () => <div data-testid="mock-grid" />,
    Html: ({ children }: any) => <div>{children}</div>,
  };
});

describe('App', () => {
  it('renders Model Tree, Viewport, and Properties panels', () => {
    render(<App />);
    expect(screen.getByText(/Model Tree/i)).toBeInTheDocument();
    expect(screen.getByText(/Properties/i)).toBeInTheDocument();
  });
});
