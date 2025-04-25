import { AlgorithmTrace, TraceStep } from './index';

// Utility function to create a copy of the array
function createArrayCopy(array: number[]): number[] {
  return [...array];
}

// Binary Search
export function binarySearch(input: { array: number[], target: number }): AlgorithmTrace {
  const { array, target } = input;
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  let comparisons = 0;
  let arrayAccesses = 0;
  let left = 0;
  let right = arrayCopy.length - 1;
  let found = false;
  
  trace.push({
    array: arrayCopy,
    stats: { comparisons, swaps: 0, arrayAccesses },
    description: `Starting binary search for target ${target}`
  });
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    arrayAccesses++;
    
    trace.push({
      array: arrayCopy,
      currentIndices: [mid],
      visitedIndices: Array.from({ length: mid - left + 1 }, (_, i) => left + i)
        .concat(Array.from({ length: right - mid }, (_, i) => mid + i + 1)),
      stats: { comparisons, swaps: 0, arrayAccesses },
      description: `Checking element at middle index ${mid}: ${arrayCopy[mid]}`
    });
    
    comparisons++;
    
    if (arrayCopy[mid] === target) {
      // Target found
      trace.push({
        array: arrayCopy,
        currentIndices: [mid],
        stats: { comparisons, swaps: 0, arrayAccesses },
        description: `Target ${target} found at index ${mid}`
      });
      found = true;
      break;
    } else if (arrayCopy[mid] < target) {
      // Target is in the right half
      left = mid + 1;
      
      trace.push({
        array: arrayCopy,
        visitedIndices: Array.from({ length: mid - left + 1 }, (_, i) => left + i),
        stats: { comparisons, swaps: 0, arrayAccesses },
        description: `Target ${target} is greater than ${arrayCopy[mid]}, searching right half: indices ${mid + 1} to ${right}`
      });
    } else {
      // Target is in the left half
      right = mid - 1;
      
      trace.push({
        array: arrayCopy,
        visitedIndices: Array.from({ length: right - mid }, (_, i) => mid + i + 1),
        stats: { comparisons, swaps: 0, arrayAccesses },
        description: `Target ${target} is less than ${arrayCopy[mid]}, searching left half: indices ${left} to ${mid - 1}`
      });
    }
  }
  
  if (!found) {
    trace.push({
      array: arrayCopy,
      stats: { comparisons, swaps: 0, arrayAccesses },
      description: `Target ${target} not found in the array`
    });
  }
  
  return trace;
}

// Linear Search
export function linearSearch(input: { array: number[], target: number }): AlgorithmTrace {
  const { array, target } = input;
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  let comparisons = 0;
  let arrayAccesses = 0;
  let found = false;
  
  trace.push({
    array: arrayCopy,
    stats: { comparisons, swaps: 0, arrayAccesses },
    description: `Starting linear search for target ${target}`
  });
  
  for (let i = 0; i < arrayCopy.length; i++) {
    arrayAccesses++;
    comparisons++;
    
    trace.push({
      array: arrayCopy,
      currentIndices: [i],
      visitedIndices: Array.from({ length: i }, (_, idx) => idx),
      stats: { comparisons, swaps: 0, arrayAccesses },
      description: `Checking element at index ${i}: ${arrayCopy[i]}`
    });
    
    if (arrayCopy[i] === target) {
      // Target found
      trace.push({
        array: arrayCopy,
        currentIndices: [i],
        visitedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
        stats: { comparisons, swaps: 0, arrayAccesses },
        description: `Target ${target} found at index ${i}`
      });
      found = true;
      break;
    }
  }
  
  if (!found) {
    trace.push({
      array: arrayCopy,
      visitedIndices: Array.from({ length: arrayCopy.length }, (_, i) => i),
      stats: { comparisons, swaps: 0, arrayAccesses },
      description: `Target ${target} not found in the array`
    });
  }
  
  return trace;
}
