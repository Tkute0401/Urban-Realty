import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App.jsx';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main', { hidden: true })).toBeInTheDocument();
  });
});
