import { render, screen, debug } from "@testing-library/react";
import App from "./App";
import useFetchedData from "./hooks/useFetchedData";

jest.mock("./hooks/useFetchedData");

const setup = () => render(<App />);

describe("App", () => {
  beforeEach(() => {
    useFetchedData.mockReturnValue({ data: null, error: null, loading: true });
  });

  it("should render loading text", () => {
    setup();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  describe("when data is fetched successfully", () => {
    beforeEach(() => {
      const mockedData = [
        {
          body: "mocked body",
          id: 1,
          title: "mock title",
          userId: 1,
        },
      ];
      useFetchedData.mockReturnValue({
        data: mockedData,
        error: null,
        loading: false,
      });
    });

    it("should render list of todos", async () => {
      setup();
      const list = await screen.findByRole("list");
      expect(list).toBeInTheDocument();
    });

    it("should not render loading text", () => {
      setup();
      const loadingText = screen.queryByText("Loading...");
      expect(loadingText).not.toBeInTheDocument();
    });
  });

  describe("when data is not fetched successfully", () => {
    beforeEach(() => {
      const mockedError = new Error("mocked error");
      useFetchedData.mockReturnValue({
        data: null,
        error: mockedError,
        loading: false,
      });
    });

    it("should render the error message", async () => {
      setup();
      const errorMessage = await screen.findByText("Error: mocked error");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
