
import React from "react";
import { useMachine } from "@xstate/react";
import { dtmMachine } from "@/machines/dtmMachine";
import { BackToDashboard } from "@/components/BackToDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";

const TimeMachineDemo = () => {
  const [state, send] = useMachine(dtmMachine, {
    actors: {
      fetchDecisionTimeline: async ({ input }) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock response for demo
        return {
          timeline_short: [
            { date: "2025-07-01", event: "Initial decision implementation" },
            { date: "2025-08-15", event: "First milestone achieved" },
            { date: "2025-09-30", event: "Quarterly review and adjustment" },
          ],
          timeline_long: [
            { date: "2025-12-31", event: "Year-end major milestone" },
            { date: "2026-06-30", event: "Mid-year strategic pivot" },
            { date: "2026-12-31", event: "Full transformation complete" },
          ]
        };
      }
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get("decision") as string;
    if (input.trim()) {
      send({ type: "SUBMIT", input });
    }
  };

  const renderTimeline = (timeline: any[], title: string, icon: React.ReactNode) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((milestone, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">{milestone.date}</p>
                <p className="text-muted-foreground">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-warfare-dark text-white p-6">
      <div className="max-w-4xl mx-auto">
        <BackToDashboard />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Decision Time-Machine</h1>
          <p className="text-warfare-gray">
            Visualize the potential timelines of your decisions with AI assistance.
          </p>
        </div>

        {state.matches("IDLE") && (
          <Card>
            <CardHeader>
              <CardTitle>What decision are you considering?</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="decision"
                  placeholder="Describe your decision scenario..."
                  className="w-full"
                  maxLength={240}
                />
                <Button type="submit" className="w-full">
                  Generate Timeline
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {state.matches("SUBMITTING") && (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Analyzing decision pathways...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {state.matches("ERROR") && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold">Analysis Failed</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {state.context.error || "Something went wrong while analyzing your decision."}
              </p>
              <Button onClick={() => send({ type: "RETRY" })} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {state.matches("SUCCESS") && state.context.result && (
          <div>
            {renderTimeline(
              state.context.result.timeline_short,
              "Short-term Timeline (3-6 months)",
              <Clock className="h-5 w-5" />
            )}
            
            {renderTimeline(
              state.context.result.timeline_long,
              "Long-term Timeline (1-2 years)",
              <TrendingUp className="h-5 w-5" />
            )}
            
            <div className="flex gap-4">
              <Button onClick={() => send({ type: "NEW_DECISION" })}>
                Analyze New Decision
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeMachineDemo;
