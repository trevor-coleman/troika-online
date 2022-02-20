import React from 'react';
import {render, screen} from './testing/custom-renderer'
import App from './App';

describe("<App/>", ()=> {
  it("Renders the home nav when loaded", async () => {
    render(<App />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  })
})
