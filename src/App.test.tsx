import React from 'react';
import {render, screen, waitForElementToBeRemoved} from './testing/custom-renderer'
import App from './App';
import {useFirebase} from 'react-redux-firebase';

describe("<App/>", ()=> {
  it("Renders the home nav when loaded", async () => {
    render(<App />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  })
})
