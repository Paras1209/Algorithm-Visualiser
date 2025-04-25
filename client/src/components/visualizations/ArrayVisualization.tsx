import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

type ArrayVisualizationProps = {
  array: number[];
  currentIndices?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  visitedIndices?: number[];
  algorithmName?: string;
};

export function ArrayVisualization({
  array,
  currentIndices = [],
  comparingIndices = [],
  swappingIndices = [],
  sortedIndices = [],
  visitedIndices = [],
  algorithmName = "Algorithm"
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

  const getBarLabel = (index: number) => {
    if (swappingIndices.includes(index)) {
      return "Swapping";
    } else if (currentIndices.includes(index)) {
      return "Current";
    } else if (comparingIndices.includes(index)) {
      return "Comparing";
    } else if (sortedIndices.includes(index)) {
      return "Sorted";
    } else if (visitedIndices.includes(index)) {
      return "Visited";
    }
    return "";
  };

  if (!array || array.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <p>No data to visualize</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4 p-2 bg-slate-100 rounded-md">
        <h3 className="text-lg font-semibold mb-1 text-center text-slate-800">
          {algorithmName} Visualization
        </h3>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary-500 rounded mr-1"></div>
            <span>Default</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
            <span>Swapping</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
            <span>Current/Sorted</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-accent-500 rounded mr-1"></div>
            <span>Comparing</span>
          </div>
        </div>
        <div className="mt-2 text-center text-sm text-slate-600">
          Data being visualized: [{array.join(', ')}]
        </div>
      </div>
      
      <div className="flex items-end flex-1 w-full gap-1" ref={containerRef}>
        {array.map((value, index) => (
          <div
            key={index}
            className={`visualization-element flex-1 rounded-t-md ${getBarColor(value, index)} flex justify-center items-end text-white text-xs font-mono relative group`}
            style={{ 
              height: `calc(10% + ${(value / maxValue) * 85}%)`,
              transition: "all 0.3s ease"
            }}
          >
            <span className="absolute -top-5 select-none">{value}</span>
            {getBarLabel(index) && (
              <span className="absolute -bottom-6 text-xs text-slate-600 hidden group-hover:block">{getBarLabel(index)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArrayVisualization;
