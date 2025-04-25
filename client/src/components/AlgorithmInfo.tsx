import { Algorithm } from "@/lib/algorithms/index";

type AlgorithmInfoProps = {
  algorithm: Algorithm | null;
};

export function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  if (!algorithm) {
    return (
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Select an Algorithm</h2>
            <p className="text-slate-600 mt-1">
              Choose an algorithm from the sidebar to begin visualization
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{algorithm.name}</h2>
          <p className="text-slate-600 mt-1">{algorithm.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="w-3 h-3 rounded-full bg-accent-500"></span>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Swapping</span>
          </div>
          {algorithm.type === "pathfinding" || algorithm.type === "graph" ? (
            <div className="flex items-center gap-1 text-sm">
              <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
              <span>Visited</span>
            </div>
          ) : null}
          {algorithm.type === "searching" ? (
            <div className="flex items-center gap-1 text-sm">
              <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
              <span>Searched</span>
            </div>
          ) : null}
          {algorithm.type === "sorting" ? (
            <div className="flex items-center gap-1 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Sorted</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AlgorithmInfo;
