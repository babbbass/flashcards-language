import { useState, useTransition } from "react";

export type Feedback = { kind: "done" | "error"; text: string };

/**
 * Runs a server action in a transition and keeps the message to show afterwards.
 * `task` returns the success text, or null when the action refused the request.
 */
export const useActionFeedback = (errorText: string) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (task: () => Promise<string | null>) =>
    startTransition(async () => {
      try {
        const text = await task();
        setFeedback(text === null ? { kind: "error", text: errorText } : { kind: "done", text });
      } catch {
        // Network or server failure: shown to the user as the error message, never silent
        setFeedback({ kind: "error", text: errorText });
      }
    });

  return { pending, feedback, run };
};
