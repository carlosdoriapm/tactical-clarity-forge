
import React from "react";
interface SwipePaginationProps {
  index: number;
  total: number;
}
const SwipePagination: React.FC<SwipePaginationProps> = ({ index, total }) => (
  <nav className="flex justify-center items-center my-4 gap-2" aria-label="Timeline Pagination">
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        className={`w-2 h-2 rounded-full ${index === i ? 'bg-cyan-400' : 'bg-cyan-400/30'} transition-all duration-200`}
        style={{ margin: '0 4px' }}
      />
    ))}
  </nav>
);
export default SwipePagination;
