import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

type ArrayVisualizationProps = {
  array: number[];
  currentIndices?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  visitedIndices?: number[];
};

export function ArrayVisualization({
  array,
  currentIndices = [],
  comparingIndices = [],
  swappingIndices = [],
  sortedIndices = [],
  visitedIndices = []
}: ArrayVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxValue, setMaxValue] = useState<number>(100);
  
  useEffect(() => {
    // Find the maximum value in the array for scaling
    if (array && array.length > 0) {
      setMaxValue(Math.max(...array));
    }
  }, [array]);

  const getBarColor = (value: number, index: number) => {
    if (swappingIndices.includes(index)) {
      return "bg-red-500"; // Swapping
    } else if (currentIndices.includes(index)) {
      return "bg-green-500"; // Current
    } else if (comparingIndices.includes(index)) {
      return "bg-accent-500"; // Comparing
    } else if (sortedIndices.includes(index)) {
      return "bg-green-500"; // Sorted
    } else if (visitedIndices.includes(index)) {
      return "bg-secondary-500"; // Visited (for search algorithms)
    } else {
      return "bg-primary-500"; // Default
    }
  };

  if (!array || array.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <p>No data to visualize</p>
      </div>
    );
  }

  return (
    <div className="flex items-end h-full w-full gap-1" ref={containerRef}>
      {array.map((value, index) => (
        <div
          key={index}
          className={`visualization-element flex-1 rounded-t-md ${getBarColor(value, index)} flex justify-center items-end text-white text-xs font-mono relative`}
          style={{ 
            height: `calc(10% + ${(value / maxValue) * 85}%)`,
            transition: "all 0.3s ease"
          }}
        >
          <span className="absolute -top-5 select-none">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default ArrayVisualization;
