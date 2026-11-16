import { useEffect, useRef, useState } from "react";
import { LoaderCircle, RotateCcw, Send, Sparkles } from "lucide-react";
import { requestAIInsight } from "../services/aiApi";
import type { AIInsightRequest } from "../types";

const exampleQuestions = [
  "Which region has the highest activity?",
  "Compare activity across all regions.",
  "Which location has the highest activity count?",
  "Summarise the monthly location activity trend.",
  "Which regions should receive more attention based on the available data?",
  "Give me an overall summary of the current location dataset.",
];

function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      activeRequest.current?.abort();
    },
    [],
  );

  async function askQuestion(questionToAsk: string) {
    const trimmedQuestion = questionToAsk.trim();
    if (!trimmedQuestion || activeRequest.current) {
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;
    setLastQuestion(trimmedQuestion);
    setAnswer(null);
    setError(null);
    setIsLoading(true);

    try {
      const request: AIInsightRequest = { question: trimmedQuestion };
      const response = await requestAIInsight(request, controller.signal);

      if (!controller.signal.aborted) {
        setAnswer(response.answer);
      }
    } catch (requestError: unknown) {
      if (!controller.signal.aborted) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to generate an answer. Please try again.",
        );
      }
    } finally {
      if (!controller.signal.aborted && activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  }

  const canSubmit = question.trim().length > 0 && !isLoading;

  return (
    <section
      id="ai-insights"
      aria-labelledby="ai-insights-heading"
      className="mt-8 min-w-0"
    >
      <header className="mb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div>
            <h2
              id="ai-insights-heading"
              className="text-xl font-semibold tracking-tight text-slate-900"
            >
              AI Location Insights
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Ask questions about the locations and activity in this dataset.
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void askQuestion(question);
          }}
        >
          <label
            htmlFor="ai-insight-question"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Your question
          </label>
          <textarea
            id="ai-insight-question"
            value={question}
            maxLength={500}
            rows={3}
            disabled={isLoading}
            onChange={(event) => setQuestion(event.currentTarget.value)}
            placeholder="For example, which region has the highest activity?"
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
          />
          <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-500">
              {question.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? (
                <LoaderCircle
                  size={16}
                  aria-hidden="true"
                  className="animate-spin"
                />
              ) : (
                <Send size={16} aria-hidden="true" />
              )}
              {isLoading ? "Generating…" : "Ask AI"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Example questions
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {exampleQuestions.map((example) => (
              <button
                key={example}
                type="button"
                disabled={isLoading}
                onClick={() => setQuestion(example)}
                className="rounded-full border border-slate-200 px-3 py-2 text-left text-xs leading-4 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6" aria-busy={isLoading}>
          {isLoading ? (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800"
            >
              <LoaderCircle
                size={17}
                aria-hidden="true"
                className="animate-spin"
              />
              Analyzing the GeoInsight dataset…
            </p>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-red-800">
                Could not generate insights: {error}
              </p>
              <button
                type="button"
                onClick={() => void askQuestion(lastQuestion)}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-800 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <RotateCcw size={15} aria-hidden="true" />
                Retry
              </button>
            </div>
          ) : answer ? (
            <section
              aria-labelledby="ai-insight-answer-heading"
              className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5"
            >
              <h3
                id="ai-insight-answer-heading"
                className="text-sm font-semibold text-slate-900"
              >
                AI response
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {answer}
              </p>
            </section>
          ) : (
            <p
              role="status"
              className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500"
            >
              Choose an example or enter a question to get started.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AiAssistant;
