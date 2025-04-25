import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AlgorithmInfo from "@/components/AlgorithmInfo";
import VisualizationArea from "@/components/VisualizationArea";
import { 
  allAlgorithms, 
  sortingAlgorithms, 
  searchingAlgorithms, 
  pathfindingAlgorithms, 
  graphAlgorithms,
  getAlgorithmById,
  Algorithm,
  TraceStep
} from "@/lib/algorithms/index";
import { useMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export function Visualizer() {
  const params = useParams();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  // State for algorithm selection and visualization controls
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [arraySize, setArraySize] = useState<number>(20);
  const [dataType, setDataType] = useState<string>("random");
  const [animationSpeed, setAnimationSpeed] = useState<number>(3);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Effect to load algorithm if ID is in URL
  useEffect(() => {
    if (params.algorithmId) {
      const algorithmId = parseInt(params.algorithmId, 10);
      const algorithm = getAlgorithmById(algorithmId);
      if (algorithm) {
        setSelectedAlgorithm(algorithm);
      }
    }
  }, [params.algorithmId]);
  
  // Effect to generate initial data when algorithm is selected
  useEffect(() => {
    if (selectedAlgorithm) {
      generateNewData();
    }
  }, [selectedAlgorithm]);
  
  // Effect to handle animation playback
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isPlaying && currentStep < trace.length - 1) {
      // Calculate delay based on animation speed (1 = slow, 5 = fast)
      const delay = 1000 / animationSpeed;
      
      animationTimer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, delay);
    } else if (isPlaying && currentStep >= trace.length - 1) {
      // Stop playing when we reach the end
      setIsPlaying(false);
    }
    
    return () => {
      clearTimeout(animationTimer);
    };
  }, [isPlaying, currentStep, trace, animationSpeed]);
  
  // Function to handle algorithm selection
  const handleSelectAlgorithm = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  // Function to generate new data
  const generateNewData = useCallback(() => {
    if (!selectedAlgorithm) return;
    
    setCurrentStep(0);
    setIsPlaying(false);
    
    try {
      let input;
      console.log("Generating input for algorithm:", selectedAlgorithm.name, "Type:", selectedAlgorithm.type);
      
      if (selectedAlgorithm.type === 'sorting') {
        input = selectedAlgorithm.generateInput(arraySize, dataType);
        console.log("Generated sorting input:", input);
      } else if (selectedAlgorithm.type === 'searching') {
        input = selectedAlgorithm.generateInput(arraySize, dataType);
        console.log("Generated searching input:", input);
      } else if (selectedAlgorithm.type === 'pathfinding' || selectedAlgorithm.type === 'graph') {
        input = selectedAlgorithm.generateInput(10, 'random');
        console.log("Generated graph input:", input);
      }
      
      console.log("Executing algorithm...");
      const algorithmTrace = selectedAlgorithm.execute(input);
      console.log("Algorithm execution result:", algorithmTrace);
      console.log("First trace step:", algorithmTrace[0]);
      
      setTrace(algorithmTrace);
      
      toast({
        title: "New data generated",
        description: `Created ${selectedAlgorithm.type === 'sorting' || selectedAlgorithm.type === 'searching' ? 'array' : 'graph'} with ${selectedAlgorithm.type === 'sorting' || selectedAlgorithm.type === 'searching' ? arraySize : 'nodes'} elements`,
      });
    } catch (error) {
      console.error('Error generating data:', error);
      toast({
        title: "Error",
        description: "Failed to generate new data",
        variant: "destructive",
      });
    }
  }, [selectedAlgorithm, arraySize, dataType]);
  
  // Control functions
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleStepForward = () => {
    if (currentStep < trace.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  // Get algorithms based on their types
  const algorithms = [
    ...sortingAlgorithms,
    ...searchingAlgorithms,
    ...pathfindingAlgorithms,
    ...graphAlgorithms
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar
          algorithms={algorithms}
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={handleSelectAlgorithm}
          arraySize={arraySize}
          onArraySizeChange={setArraySize}
          dataType={dataType}
          onDataTypeChange={setDataType}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={setAnimationSpeed}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <AlgorithmInfo algorithm={selectedAlgorithm} />
          
          <VisualizationArea
            algorithm={selectedAlgorithm}
            trace={trace}
            currentStep={currentStep}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onGenerateNewData={generateNewData}
            animationSpeed={animationSpeed}
            dataType={dataType}
          />
          
          {selectedAlgorithm && (
            <div className="bg-white border-t border-slate-200 p-4">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">How {selectedAlgorithm.name} Works</h3>
                  <ol className="text-sm space-y-1 pl-5 list-decimal text-slate-700">
                    {selectedAlgorithm.explanation.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Complexity</h3>
                  <div className="text-sm space-y-1 text-slate-700">
                    <p><span className="font-medium">Time Complexity:</span> {selectedAlgorithm.timeComplexity}</p>
                    <p><span className="font-medium">Space Complexity:</span> {selectedAlgorithm.spaceComplexity}</p>
                    {selectedAlgorithm.bestCase && (
                      <p><span className="font-medium">Best Case:</span> {selectedAlgorithm.bestCase}</p>
                    )}
                    {selectedAlgorithm.averageCase && (
                      <p><span className="font-medium">Average Case:</span> {selectedAlgorithm.averageCase}</p>
                    )}
                    {selectedAlgorithm.worstCase && (
                      <p><span className="font-medium">Worst Case:</span> {selectedAlgorithm.worstCase}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Pseudocode</h3>
                  <pre className="text-xs font-mono bg-slate-800 text-slate-100 p-2 rounded-md overflow-auto">
                    <code>{selectedAlgorithm.pseudocode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Visualizer;
