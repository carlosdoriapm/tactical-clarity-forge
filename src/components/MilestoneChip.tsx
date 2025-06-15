
import React from "react";
import { motion } from "framer-motion";
interface MilestoneChipProps {
  text: string;
  delay?: number;
}
const MilestoneChip: React.FC<MilestoneChipProps> = ({ text, delay = 0 }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 8 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 270, damping: 22, delay }}
    className="bg-white/20 rounded-full px-4 py-2 font-medium text-white shadow-md"
  >
    {text}
  </motion.div>
);
export default MilestoneChip;
