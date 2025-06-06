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
  const [animated, setAnimated] = useState(false);
  
  // Trigger animation effect on indices change
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndices, comparingIndices, swappingIndices, sortedIndices, visitedIndices]);
  
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
      return "bg-purple-500"; // Comparing
    } else if (sortedIndices.includes(index)) {
      return "bg-green-300"; // Sorted
    } else if (visitedIndices.includes(index)) {
      return "bg-yellow-500"; // Visited (for search algorithms)
    } else {
      return "bg-blue-500"; // Default
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
            <div className="w-4 h-4 bg-blue-500 rounded mr-1"></div>
            <span>Default</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
            <span>Swapping</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 rounded mr-1"></div>
            <span>Sorted</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-1"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-1"></div>
            <span>Visited</span>
          </div>
        </div>
        <div className="mt-2 text-center text-sm text-slate-600">
          Data being visualized: [{array.join(', ')}]
        </div>
      </div>
      
      <div className="flex items-end justify-center flex-1 w-full gap-0.5 p-4" ref={containerRef}>
        {array.map((value, index) => (
          <div
            key={index}
            className={`visualization-element rounded-t-md ${getBarColor(value, index)} ${
              swappingIndices.includes(index) 
                ? 'swapping shadow-lg' 
                : (currentIndices.includes(index) || comparingIndices.includes(index))
                  ? 'active shadow-lg' 
                  : ''
            } flex justify-center items-end text-white text-xs font-mono relative group hover:opacity-90`}
            style={{ 
              height: `calc(10% + ${(value / maxValue) * 80}%)`,
              transition: "all 0.3s ease",
              width: `${Math.max(100 / array.length - 1, 8)}px`,
              transform: animated && (swappingIndices.includes(index) || currentIndices.includes(index)) 
                ? 'scale(1.05)' 
                : 'scale(1)'
            }}
          >
            <span className="absolute -top-5 select-none">{array.length <= 30 ? value : ''}</span>
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
