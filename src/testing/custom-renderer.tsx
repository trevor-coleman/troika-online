import React, { PropsWithChildren} from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import store from '../store'

import { Provider } from 'react-redux';

const Wrapper = ({children}:PropsWithChildren<any>) => {
  return (
      <MemoryRouter><Provider store={store}>{children}</Provider></MemoryRouter>);
};

const customRender = (ui: React.ReactElement, options?: Pick<RenderOptions<any>, "container" | "baseElement" | "hydrate" | "wrapper">) => render(ui,
    {wrapper: Wrapper, ...options});

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
