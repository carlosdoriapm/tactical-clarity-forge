
import React from "react";
import { motion } from "framer-motion";

interface TimelineCardProps {
  label: string;
  milestones: string[];
}

const TimelineCard: React.FC<TimelineCardProps> = ({ label, milestones }) => (
  <motion.div
    initial={{ y: 32, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    className="w-full md:w-[48%] bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg mb-6 flex flex-col"
  >
    <div className="px-5 py-3 rounded-t-2xl bg-cyan-500/20">
      <span className="font-bold text-sm text-cyan-400">{label}</span>
    </div>
    <ol className="flex-1 overflow-y-auto snap-y snap-mandatory px-4 py-4 flex flex-col gap-3">
      {milestones.map((milestone, idx) => (
        <motion.li
          key={milestone}
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.07 * idx }}
          className="snap-start"
        >
          <div className="bg-white/20 rounded-full px-4 py-2 font-medium text-white text-base shadow-md">
            {milestone}
          </div>
        </motion.li>
      ))}
    </ol>
  </motion.div>
);

export default TimelineCard;
