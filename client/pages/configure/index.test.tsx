import { screen } from "@testing-library/react";
import { render } from "../../utils/test-utils";
import Configure from "./";

describe("Configure", () => {
  it("renders query parameters", () => {
    render(<Configure />, { router: { query: { foo: "bar" } } });
    screen.getByText(/foo/);
    screen.getByText(/bar/);
  });
});
