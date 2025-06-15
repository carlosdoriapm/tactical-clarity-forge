
import { useCallback } from "react";

// Stub: replace this with your actual telemetry/reporting implementation
const useTelemetry = () => {
  // eslint-disable-next-line
  return useCallback((event: string, payload?: Record<string, any>) => {
    // Send event/payload to your telemetry pipeline
    if (typeof window !== "undefined") {
      window.console.log("[Telemetry]", event, payload);
    }
  }, []);
};

export default useTelemetry;
