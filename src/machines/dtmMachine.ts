
import { createMachine, assign } from "xstate";

export type DTMState = "IDLE" | "SUBMITTING" | "SUCCESS" | "ERROR";

type Milestone = { date: string; event: string };
type Timeline = Milestone[];

export interface DTMContext {
  input: string;
  result: { timeline_short: Timeline; timeline_long: Timeline } | null;
  error: string | null;
}

export type DTMEvent =
  | { type: "SUBMIT"; input: string }
  | { type: "SUCCESS"; result: any }
  | { type: "ERROR"; error: string }
  | { type: "RETRY" }
  | { type: "NEW_DECISION" };

export const dtmMachine = createMachine<DTMContext, DTMEvent>(
  {
    id: "dtm",
    initial: "IDLE",
    context: {
      input: "",
      result: null,
      error: null,
    },
    states: {
      IDLE: {
        on: {
          SUBMIT: {
            target: "SUBMITTING",
            actions: assign({
              input: (_, event) => (event.type === "SUBMIT" ? event.input : ""),
              result: (_) => null,
              error: (_) => null,
            }),
          },
        },
      },
      SUBMITTING: {
        invoke: {
          src: "fetchDecisionTimeline",
          onDone: {
            target: "SUCCESS",
            actions: assign({ result: (_, event) => event.data, error: (_) => null }),
          },
          onError: {
            target: "ERROR",
            actions: assign({ error: (_, event) => event.data || "Unknown error" }),
          },
        },
      },
      SUCCESS: {
        on: {
          NEW_DECISION: {
            target: "SUBMITTING",
            actions: assign({
              input: (_, event) => (event.type === "SUBMIT" ? event.input : ""),
              result: (_) => null,
              error: (_) => null,
            }),
          },
        },
      },
      ERROR: {
        on: {
          RETRY: "SUBMITTING",
        },
      },
    },
  },
  {
    services: {
      fetchDecisionTimeline: async (context) => {
        // Calls API (handled in component via useInterpret)
        return {};
      },
    },
  }
);
