import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Algorithm, 
  AlgorithmType,
  allAlgorithms,
  getAlgorithmById, 
  getAlgorithmsByType 
} from '@/lib/algorithms/index';

export function useAlgorithm() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [arraySize, setArraySize] = useState<number>(20);
  const [dataType, setDataType] = useState<string>("random");
  const { toast } = useToast();

  // Select algorithm by ID
  const selectAlgorithmById = useCallback((id: number) => {
    const algorithm = getAlgorithmById(id);
    
    if (algorithm) {
      setSelectedAlgorithm(algorithm);
      return true;
    } else {
      toast({
        title: "Algorithm not found",
        description: `Could not find algorithm with ID ${id}`,
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Select algorithm by object
  const selectAlgorithm = useCallback((algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
  }, []);

  // Get algorithms by type
  const getAlgorithmsByCategory = useCallback((type: AlgorithmType) => {
    return getAlgorithmsByType(type);
  }, []);

  // Generate input data for the selected algorithm
  const generateInputData = useCallback(() => {
    if (!selectedAlgorithm) {
      toast({
        title: "No algorithm selected",
        description: "Please select an algorithm first",
        variant: "destructive"
      });
      return null;
    }

    try {
      let input;
      
      if (selectedAlgorithm.type === 'sorting') {
        input = selectedAlgorithm.generateInput(arraySize, dataType);
      } else if (selectedAlgorithm.type === 'searching') {
        input = selectedAlgorithm.generateInput(arraySize, dataType);
      } else if (selectedAlgorithm.type === 'pathfinding' || selectedAlgorithm.type === 'graph') {
        input = selectedAlgorithm.generateInput(arraySize, dataType);
      }
      
      return input;
    } catch (error) {
      console.error('Error generating input data:', error);
      toast({
        title: "Error",
        description: "Failed to generate input data",
        variant: "destructive"
      });
      return null;
    }
  }, [selectedAlgorithm, arraySize, dataType, toast]);

  // Execute the selected algorithm with input data
  const executeAlgorithm = useCallback((input: any) => {
    if (!selectedAlgorithm) {
      toast({
        title: "No algorithm selected",
        description: "Please select an algorithm first",
        variant: "destructive"
      });
      return null;
    }

    try {
      const trace = selectedAlgorithm.execute(input);
      return trace;
    } catch (error) {
      console.error('Error executing algorithm:', error);
      toast({
        title: "Error",
        description: "Failed to execute algorithm",
        variant: "destructive"
      });
      return null;
    }
  }, [selectedAlgorithm, toast]);

  return {
    selectedAlgorithm,
    arraySize,
    dataType,
    allAlgorithms,
    selectAlgorithm,
    selectAlgorithmById,
    setArraySize,
    setDataType,
    getAlgorithmsByCategory,
    generateInputData,
    executeAlgorithm
  };
}
