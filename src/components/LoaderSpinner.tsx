
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderSpinnerProps {
  show?: boolean;
  onTimeout?: () => void;
  timeoutMs?: number;
}

const LoaderSpinner: React.FC<LoaderSpinnerProps> = ({
  show = true,
  onTimeout,
  timeoutMs = 3000
}) => {
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (show && onTimeout) {
      timeoutRef.current = window.setTimeout(onTimeout, timeoutMs);
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [show, onTimeout, timeoutMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="loader"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, duration: 0.3 }}
            className="w-16 h-16 flex items-center justify-center"
          >
            <span className="inline-block w-11 h-11 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" aria-label="Loading…" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderSpinner;
