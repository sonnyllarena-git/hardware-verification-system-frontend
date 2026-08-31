import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";

test("renders with two input fields", () => {
  const { container } = render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
  expect(container.querySelectorAll("input")).toHaveLength(2);
});
