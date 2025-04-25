import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  ClockIcon,
  ArrowLeftRight,
  LayersIcon,
} from "lucide-react";

type ControlPanelProps = {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onGenerateNewData: () => void;
  stats: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
  currentStep: number;
  totalSteps: number;
  description: string;
};

export function ControlPanel({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onGenerateNewData,
  stats,
  currentStep,
  totalSteps,
  description,
}: ControlPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg mt-4 p-3 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="flex items-center gap-2 justify-center w-full md:w-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 relative"
          data-tooltip="Reset"
        >
          <RotateCcwIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onStepBackward}
          disabled={currentStep <= 0}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 relative"
          data-tooltip="Step Back"
        >
          <SkipBackIcon className="h-5 w-5" />
        </Button>
        <Button
          variant={isPlaying ? "outline" : "default"}
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentStep >= totalSteps - 1}
          className="p-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center w-10 h-10 relative"
          data-tooltip={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 relative"
          data-tooltip="Step Forward"
        >
          <SkipForwardIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onGenerateNewData}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 relative"
          data-tooltip="Generate New Data"
        >
          <RefreshCwIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full md:w-auto text-center md:text-left">
        <p className="text-sm text-slate-600">{description}</p>
        <p className="text-xs text-slate-500 mt-1">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <div className="px-3 py-1 rounded-md bg-slate-100 flex items-center gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>Comparisons: {stats.comparisons}</span>
        </div>
        <div className="px-3 py-1 rounded-md bg-slate-100 flex items-center gap-1">
          <ArrowLeftRight className="h-4 w-4" />
          <span>Swaps: {stats.swaps}</span>
        </div>
        <div className="px-3 py-1 rounded-md bg-slate-100 flex items-center gap-1">
          <LayersIcon className="h-4 w-4" />
          <span>Array Accesses: {stats.arrayAccesses}</span>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
