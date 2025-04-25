import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Algorithm, AlgorithmType, TraceStep } from "@/lib/algorithms/index";
import ArrayVisualization from "./visualizations/ArrayVisualization";
import GraphVisualization from "./visualizations/GraphVisualization";
import ControlPanel from "./ControlPanel";

type VisualizationAreaProps = {
  algorithm: Algorithm | null;
  trace: TraceStep[];
  currentStep: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onGenerateNewData: () => void;
  animationSpeed: number;
  dataType?: string;
};

export function VisualizationArea({
  algorithm,
  trace,
  currentStep,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onGenerateNewData,
  animationSpeed,
  dataType = 'random',
}: VisualizationAreaProps) {
  
  // Determine which visualization to show based on the algorithm type
  const renderVisualization = () => {
    if (!algorithm || !trace || trace.length === 0) {
      return (
        <div className="flex h-full items-center justify-center text-slate-400">
          <p>Select an algorithm and generate data to visualize</p>
        </div>
      );
    }

    // Get the current step data
    const currentStepData = trace[currentStep];

    switch (algorithm.type) {
      case 'sorting':
      case 'searching':
        return (
          <ArrayVisualization
            array={currentStepData.array || []}
            currentIndices={currentStepData.currentIndices || []}
            comparingIndices={currentStepData.comparingIndices || []}
            swappingIndices={currentStepData.swappingIndices || []}
            sortedIndices={currentStepData.sortedIndices || []}
            visitedIndices={currentStepData.visitedIndices || []}
            algorithmName={algorithm.name}
          />
        );
      case 'pathfinding':
      case 'graph':
        return (
          <GraphVisualization
            graph={currentStepData.graph}
            currentIndices={currentStepData.currentIndices || []}
            comparingIndices={currentStepData.comparingIndices || []}
            visitedIndices={currentStepData.visitedIndices || []}
            pathIndices={currentStepData.pathIndices || []}
          />
        );
      default:
        return (
          <div className="flex h-full items-center justify-center text-slate-400">
            <p>Visualization not available for this algorithm type</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-4 flex flex-col overflow-hidden">
      {/* Visualization Canvas */}
      <div className="bg-white border border-slate-200 rounded-lg flex-1 p-6 flex items-end justify-center overflow-hidden">
        {renderVisualization()}
      </div>
      
      {/* Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
        onStepForward={onStepForward}
        onStepBackward={onStepBackward}
        onGenerateNewData={onGenerateNewData}
        stats={trace[currentStep]?.stats || { comparisons: 0, swaps: 0, arrayAccesses: 0 }}
        currentStep={currentStep}
        totalSteps={trace.length}
        description={trace[currentStep]?.description || ""}
        algorithmName={algorithm?.name || "Algorithm"}
        dataType={dataType}
      />
    </div>
  );
}

export default VisualizationArea;
