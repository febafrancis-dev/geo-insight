import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestAIInsight } from "../services/aiApi";
import type { AIInsightResponse } from "../types";
import AiAssistant from "./AiAssistant";

vi.mock("../services/aiApi", () => ({
  requestAIInsight: vi.fn(),
}));

const mockedRequestAIInsight = vi.mocked(requestAIInsight);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("AiAssistant", () => {
  it("renders its heading, question input, examples, and empty state", () => {
    render(<AiAssistant />);

    expect(
      screen.getByRole("heading", { name: "AI Location Insights" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Your question")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Which region has the highest activity?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Choose an example or enter a question to get started."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ask AI" })).toBeDisabled();
  });

  it("fills the question input when an example is selected", async () => {
    const user = userEvent.setup();
    render(<AiAssistant />);

    await user.click(
      screen.getByRole("button", {
        name: "Which location has the highest activity count?",
      }),
    );

    expect(screen.getByLabelText("Your question")).toHaveValue(
      "Which location has the highest activity count?",
    );
    expect(screen.getByRole("button", { name: "Ask AI" })).toBeEnabled();
  });

  it("shows loading and prevents duplicate submissions", async () => {
    const user = userEvent.setup();
    let resolveResponse: (response: AIInsightResponse) => void = () => {};
    mockedRequestAIInsight.mockReturnValue(
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
    );
    render(<AiAssistant />);

    await user.type(screen.getByLabelText("Your question"), "Compare regions");
    await user.click(screen.getByRole("button", { name: "Ask AI" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Analyzing the GeoInsight dataset…",
    );
    expect(screen.getByRole("button", { name: "Generating…" })).toBeDisabled();
    expect(mockedRequestAIInsight).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveResponse({ success: true, answer: "Regions compared." });
    });

    expect(screen.getByText("Regions compared.")).toBeInTheDocument();
  });

  it("displays a successful answer as text", async () => {
    const user = userEvent.setup();
    mockedRequestAIInsight.mockResolvedValue({
      success: true,
      answer: "<script>not markup</script>",
    });
    render(<AiAssistant />);

    await user.type(
      screen.getByLabelText("Your question"),
      "Which location has the highest activity?",
    );
    await user.click(screen.getByRole("button", { name: "Ask AI" }));

    expect(
      await screen.findByText("<script>not markup</script>"),
    ).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });

  it("shows an error and retries the last question", async () => {
    const user = userEvent.setup();
    mockedRequestAIInsight
      .mockRejectedValueOnce(new Error("AI service temporarily unavailable."))
      .mockResolvedValueOnce({
        success: true,
        answer: "North America has the highest chart value.",
      });
    render(<AiAssistant />);

    await user.type(
      screen.getByLabelText("Your question"),
      "Which region has the highest activity?",
    );
    await user.click(screen.getByRole("button", { name: "Ask AI" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "AI service temporarily unavailable.",
    );
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByText(
        "North America has the highest chart value.",
      ),
    ).toBeInTheDocument();
    expect(mockedRequestAIInsight).toHaveBeenCalledTimes(2);
    expect(mockedRequestAIInsight).toHaveBeenLastCalledWith(
      { question: "Which region has the highest activity?" },
      expect.any(AbortSignal),
    );
  });
});
