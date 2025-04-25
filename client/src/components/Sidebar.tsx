import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Slider 
} from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  SnailIcon, 
  RocketIcon 
} from "lucide-react";
import { Algorithm } from "@/lib/algorithms/index";

type SidebarProps = {
  algorithms: Algorithm[];
  selectedAlgorithm: Algorithm | null;
  onSelectAlgorithm: (algorithm: Algorithm) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  dataType: string;
  onDataTypeChange: (type: string) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
};

export function Sidebar({
  algorithms,
  selectedAlgorithm,
  onSelectAlgorithm,
  arraySize,
  onArraySizeChange,
  dataType,
  onDataTypeChange,
  animationSpeed,
  onAnimationSpeedChange
}: SidebarProps) {
  return (
    <aside className="w-full md:w-64 lg:w-80 bg-white border-r border-slate-200 p-4 md:h-[calc(100vh-57px)] md:overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Algorithms</h2>
        <div className="space-y-2">
          {algorithms.map((algorithm) => (
            <Card 
              key={algorithm.id}
              className={`border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-primary-300 hover:bg-slate-50 transition ${
                selectedAlgorithm?.id === algorithm.id ? 'border-primary-300 bg-slate-50' : ''
              }`}
              onClick={() => onSelectAlgorithm(algorithm)}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-medium ${selectedAlgorithm?.id === algorithm.id ? 'text-primary-700' : ''}`}>
                  {algorithm.name}
                </h3>
                <span className="bg-secondary-100 text-secondary-800 text-xs px-2 py-0.5 rounded-full">
                  {algorithm.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{algorithm.description}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span> {algorithm.timeComplexity}
                </span>
                <span className="mx-1">•</span>
                <span className="flex items-center">
                  <span className="mr-1">💾</span> {algorithm.spaceComplexity}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-3">Input</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Array Size</label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[arraySize]}
                  min={5}
                  max={100}
                  step={1}
                  onValueChange={(value) => onArraySizeChange(value[0])}
                  className="w-full"
                />
                <span className="text-sm font-mono text-slate-700 min-w-[30px]">{arraySize}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data Type
              </label>
              <Select value={dataType} onValueChange={onDataTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="nearly-sorted">Nearly Sorted</SelectItem>
                  <SelectItem value="reversed">Reversed</SelectItem>
                  <SelectItem value="few-unique">Few Unique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Animation</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Speed</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  <SnailIcon className="h-4 w-4" />
                </span>
                <Slider
                  value={[animationSpeed]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => onAnimationSpeedChange(value[0])}
                  className="w-full"
                />
                <span className="text-sm text-slate-500">
                  <RocketIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
