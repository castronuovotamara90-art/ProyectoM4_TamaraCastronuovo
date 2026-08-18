import { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { AuthProvider } from "../hooks/useAuth";

export function renderWithRouter(ui: ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}
