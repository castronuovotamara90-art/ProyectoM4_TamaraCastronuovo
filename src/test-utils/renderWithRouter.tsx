import { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";

export function renderWithRouter(ui: ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}
