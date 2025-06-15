
import React, { useState, useEffect } from "react";
import DecisionInput from "@/components/DecisionInput";
import LoaderSpinner from "@/components/LoaderSpinner";
import TimelineCard from "@/components/TimelineCard";
import SwipePagination from "@/components/SwipePagination";
import ErrorBanner from "@/components/ErrorBanner";
import useTelemetry from "@/hooks/useTelemetry";

// Demo data for timeline
const DEMO_MILESTONES = [
  ["Consider options", "Consult advisor", "Risk assessment", "Commit to decision", "Execute mission"],
  ["Re-evaluate plan", "Pivot approach", "Implement feedback", "Celebrate outcome"]
];

type State = "idle" | "loading" | "result" | "error";

interface TimelineData {
  label: string;
  milestones: string[];
}

const TimeMachineDemo: React.FC = () => {
  const [input, setInput] = useState(""); // decision scenario input
  const [state, setState] = useState<State>("idle");
  const [timeline, setTimeline] = useState<TimelineData[] | null>(null);
  const [page, setPage] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Explicitly type the ref to match State
  const stateRef = React.useRef<State>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const telemetry = useTelemetry();

  // Try to load last scenario (simulate localStorage restore)
  useEffect(() => {
    const stored = localStorage.getItem("dtm_cache");
    if (stored) {
      try {
        const val = JSON.parse(stored);
        if (val?.timeline) {
          setTimeline(val.timeline);
          setState("result");
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Demo: simulate async RPC with telemetry and errors.
  const handleVisualize = () => {
    setState("loading");
    setErrorMsg(null);
    telemetry("dtm_request", { input });
    setTimeout(() => {
      if (input.toLowerCase().includes("fail")) {
        setState("error");
        setErrorMsg("AI modeling failed. Try again.");
        telemetry("dtm_error", { input });
      } else {
        const timelineData = DEMO_MILESTONES.map((m, i) => ({
          label: `Strategy ${i + 1}`,
          milestones: m
        }));
        setTimeline(timelineData);
        setState("result");
        telemetry("dtm_success", { input, timeline: timelineData });
        // Save to cache for resume demo
        localStorage.setItem("dtm_cache", JSON.stringify({ timeline: timelineData }));
      }
    }, 1500);
  };

  // On swipe, move pagination
  const handleSwipe = (dir: "left" | "right") => {
    if (!timeline) return;
    if (dir === "left" && page < timeline.length - 1) {
      setPage(page + 1);
    }
    if (dir === "right" && page > 0) {
      setPage(page - 1);
    }
  };

  // Show loader spinner, auto-cancel after 3s
  useEffect(() => {
    let tm: number;
    if (state === "loading") {
      tm = window.setTimeout(() => {
        if (stateRef.current === "loading") {
          setState("error");
          setErrorMsg("Request timed out. Please try again.");
          telemetry("dtm_error", { input, reason: "timeout" });
        }
      }, 3000);
    }
    return () => {
      if (tm) clearTimeout(tm);
    };
    // eslint-disable-next-line
  }, [state]);

  // Demo swipeable handler (can be improved)
  const { useSwipeable } = require("react-swipeable");
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  // Main UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8 relative bg-warfare-dark text-white font-sans">
      {errorMsg && (
        <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      )}
      <LoaderSpinner show={state === "loading"} />
      
      {/* State: idle/input */}
      {state === "idle" && (
        <div className="max-w-xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-center" style={{fontSize: 24, lineHeight: "32px"}}>Decision Time-Machine</h1>
          <DecisionInput
            value={input}
            onChange={setInput}
            onVisualize={handleVisualize}
            maxLength={350}
            disabled={state === "loading"}
          />
          <div className="mt-8 text-white/60 text-center text-base">
            <div>Type any decision scenario and visualize the AI timeline. </div>
            <div>(Type "fail" to simulate error state.)</div>
          </div>
        </div>
      )}

      {/* State: result - timeline */}
      {state === "result" && timeline && (
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 animate-fade-in mt-4" {...swipeHandlers}>
          {timeline.map((t, i) => (
            <div
              key={i}
              className={`flex-1 ${page !== i ? "hidden md:block md:opacity-60" : ""}`}
              style={{ minWidth: 0 }}
              aria-hidden={page !== i}
            >
              {/* Animate only visible card */}
              {page === i && (
                <TimelineCard label={t.label} milestones={t.milestones} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination for timeline pages */}
      {state === "result" && timeline && timeline.length > 1 && (
        <SwipePagination index={page} total={timeline.length} />
      )}

      {/* Reset or Back */}
      {(state === "result" || state === "error") && (
        <div className="mt-6 flex justify-center">
          <button
            className="bg-warfare-blue/90 text-white rounded-lg px-6 py-2 font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
            onClick={() => {
              setState("idle");
              setInput("");
              setTimeline(null);
              setPage(0);
            }}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};
export default TimeMachineDemo;
