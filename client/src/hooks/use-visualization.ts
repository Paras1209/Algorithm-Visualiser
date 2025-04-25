import { useState, useEffect, useCallback, useRef } from 'react';
import { Algorithm, TraceStep } from '@/lib/algorithms/index';
import { useToast } from '@/hooks/use-toast';

export function useVisualization(algorithm: Algorithm | null) {
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(3);
  const [input, setInput] = useState<any>(null);
  const { toast } = useToast();
  
  // Timer reference for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Effect to handle animation playback
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (isPlaying && currentStep < trace.length - 1) {
      // Calculate delay based on animation speed (1 = slow, 5 = fast)
      // Exponential scale for more noticeable difference
      const speedMultiplier = Math.pow(2, animationSpeed - 1);
      const baseDelay = 1000; // 1 second base delay at speed 1
      const delay = baseDelay / speedMultiplier;
      
      timerRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, delay);
    } else if (isPlaying && currentStep >= trace.length - 1) {
      // Stop playing when we reach the end
      setIsPlaying(false);
      
      toast({
        title: "Visualization complete",
        description: "The algorithm has finished executing"
      });
    }
  }, [isPlaying, currentStep, trace, animationSpeed, toast]);

  // Reset when algorithm changes
  useEffect(() => {
    setTrace([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setInput(null);
  }, [algorithm]);

  // Function to generate new data and trace
  const generateNew = useCallback((inputData: any) => {
    if (!algorithm) return;
    
    setInput(inputData);
    setCurrentStep(0);
    setIsPlaying(false);
    
    try {
      const algorithmTrace = algorithm.execute(inputData);
      setTrace(algorithmTrace);
      
      toast({
        title: "New visualization ready",
        description: `${algorithm.name} is ready to be visualized`
      });
      
      return algorithmTrace;
    } catch (error) {
      console.error('Error generating visualization trace:', error);
      toast({
        title: "Error",
        description: "Failed to generate visualization",
        variant: "destructive"
      });
      return null;
    }
  }, [algorithm, toast]);

  // Control functions
  const play = useCallback(() => {
    if (trace.length === 0) {
      toast({
        title: "No data to visualize",
        description: "Generate data first to start the visualization",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep >= trace.length - 1) {
      // If at the end, reset to beginning
      setCurrentStep(0);
    }
    
    setIsPlaying(true);
  }, [trace.length, currentStep, toast]);
  
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);
  
  const stepForward = useCallback(() => {
    if (currentStep < trace.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "End reached",
        description: "Already at the last step of the visualization",
      });
    }
  }, [currentStep, trace.length, toast]);
  
  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      toast({
        title: "Start reached",
        description: "Already at the first step of the visualization",
      });
    }
  }, [currentStep, toast]);

  return {
    trace,
    currentStep,
    isPlaying,
    animationSpeed,
    currentStepData: trace[currentStep] || null,
    setAnimationSpeed,
    generateNew,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    input
  };
}
