
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

export const dtmMachine = createMachine({
  id: "dtm",
  initial: "IDLE",
  context: {
    input: "",
    result: null,
    error: null,
  } as DTMContext,
  states: {
    IDLE: {
      on: {
        SUBMIT: {
          target: "SUBMITTING",
          actions: assign({
            input: ({ event }) => event.type === "SUBMIT" ? event.input : "",
            result: () => null,
            error: () => null,
          }),
        },
      },
    },
    SUBMITTING: {
      invoke: {
        src: "fetchDecisionTimeline",
        onDone: {
          target: "SUCCESS",
          actions: assign({ 
            result: ({ event }) => event.output, 
            error: () => null 
          }),
        },
        onError: {
          target: "ERROR",
          actions: assign({ 
            error: ({ event }) => event.error || "Unknown error" 
          }),
        },
      },
    },
    SUCCESS: {
      on: {
        NEW_DECISION: {
          target: "IDLE",
          actions: assign({
            input: () => "",
            result: () => null,
            error: () => null,
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
});
