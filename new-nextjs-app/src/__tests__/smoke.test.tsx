import { render, screen } from '@testing-library/react';
import React from 'react';

function Hello() {
  return <div>Hello Squarefooot</div>;
}

describe('smoke', () => {
  it('renders without crashing', () => {
    render(<Hello />);
    expect(screen.getByText('Hello Squarefooot')).toBeInTheDocument();
  });
});