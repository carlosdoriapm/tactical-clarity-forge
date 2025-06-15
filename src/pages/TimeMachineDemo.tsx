
import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { dtmMachine } from '@/machines/dtmMachine';
import { BackToDashboard } from '@/components/BackToDashboard';
import { useTranslation } from '@/hooks/useTranslation';
import LoaderSpinner from "@/components/LoaderSpinner";

type Milestone = { date: string; event: string };
type Timeline = Milestone[];

interface TimelineViewProps {
  result: { timeline_short: Timeline; timeline_long: Timeline };
  onNew: () => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ result, onNew }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white mb-2">Short-term Timeline</h3>
      <ol className="mb-4">
        {result.timeline_short.map((m, i) => (
          <li key={i} className="text-white mb-1">
            <span className="font-mono text-cyan-300">{m.date}:</span> {m.event}
          </li>
        ))}
      </ol>
      <h3 className="text-lg font-bold text-white mb-2">Long-term Timeline</h3>
      <ol>
        {result.timeline_long.map((m, i) => (
          <li key={i} className="text-white mb-1">
            <span className="font-mono text-indigo-300">{m.date}:</span> {m.event}
          </li>
        ))}
      </ol>
    </div>
    <button
      onClick={onNew}
      className="bg-warfare-blue hover:bg-warfare-blue/80 text-white px-6 py-2 rounded-lg"
    >
      New Decision
    </button>
  </div>
);

const ErrorView: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="text-center my-10">
    <div className="text-red-400 mb-4 font-bold text-lg">Error: {error}</div>
    <button
      onClick={onRetry}
      className="bg-warfare-red hover:bg-warfare-red/80 text-white px-6 py-3 rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

function safeJSON(str: string) {
  try {
    const data = JSON.parse(str);
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray(data.timeline_short) ||
      !Array.isArray(data.timeline_long)
    ) {
      return { ok: false, error: "Malformed JSON" };
    }
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: "Invalid JSON" };
  }
}

async function fetchDecisionTimeline(decision: string) {
  if (decision.length > 240) throw new Error("DECISION_TOO_LONG");
  // User must be authenticated for caching
  const res = await fetch("/rpc/dtm_generate_v1_1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision }),
  });
  if (!res.ok) {
    let message = "API Error";
    try {
      message = (await res.json()).error || message;
    } catch {}
    throw new Error(message);
  }
  const { content } = await res.json();
  const result = safeJSON(content);
  if (!result.ok) throw new Error("E_BAD_JSON");
  return result.data;
}

const TimeMachineDemo = () => {
  const { t } = useTranslation();
  const [state, send, service] = useMachine(dtmMachine, {
    services: {
      fetchDecisionTimeline: async (ctx) => fetchDecisionTimeline(ctx.input),
    },
  });

  const [inputValue, setInputValue] = React.useState("");

  const onSubmit = useCallback(() => {
    if (inputValue.trim().length === 0) return;
    send({ type: "SUBMIT", input: inputValue });
  }, [inputValue, send]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark p-6">
      <div className="max-w-2xl mx-auto">
        <BackToDashboard />
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('decision_tm')}</h1>
          <p className="text-warfare-gray">Visualize two timelines for your decision: short and long-term</p>
        </header>
        <div className="glass-card p-6 rounded-xl">
          {state.matches("IDLE") && (
            <div>
              <textarea
                className="w-full text-white bg-slate-900/80 p-3 rounded-lg mb-4 resize-none border border-warfare-blue/20 focus:ring-2"
                value={inputValue}
                rows={4}
                maxLength={240}
                placeholder="Describe your scenario…"
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSubmit()}
              />
              <div className="flex justify-between mb-4">
                <span className="text-xs text-warfare-gray">{inputValue.length}/240</span>
                <button
                  onClick={onSubmit}
                  className="bg-warfare-blue hover:bg-warfare-blue/80 text-white px-6 py-2 rounded-lg transition-colors"
                  disabled={inputValue.length === 0}
                >Analyze</button>
              </div>
            </div>
          )}

          {state.matches("SUBMITTING") && (
            <div className="flex flex-col items-center my-8">
              <LoaderSpinner show={true} />
              <p className="text-white mt-4">Analyzing your decision…</p>
            </div>
          )}

          {state.matches("ERROR") && (
            <ErrorView error={state.context.error ?? "Unknown error"} onRetry={() => send({ type: "RETRY" })} />
          )}

          {state.matches("SUCCESS") && state.context.result && (
            <TimelineView
              result={state.context.result}
              onNew={() => {
                setInputValue("");
                send({ type: "NEW_DECISION", input: "" });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeMachineDemo;
