import { AlgorithmTrace, TraceStep } from './index';

// Utility function to create a copy of the array
function createArrayCopy(array: number[]): number[] {
  return [...array];
}

// Bubble Sort
export function bubbleSort(array: number[]): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  const len = arrayCopy.length;
  let swapped: boolean;
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let sortedIndices: number[] = [];

  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: [],
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Starting bubble sort algorithm'
  });

  for (let i = 0; i < len; i++) {
    swapped = false;
    
    for (let j = 0; j < len - i - 1; j++) {
      arrayAccesses += 2;
      comparisons++;
      
      trace.push({
        array: createArrayCopy(arrayCopy),
        currentIndices: [j],
        comparingIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, arrayAccesses },
        description: `Comparing elements at indices ${j} and ${j + 1}`
      });
      
      if (arrayCopy[j] > arrayCopy[j + 1]) {
        // Swap the elements
        [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
        swapped = true;
        swaps++;
        arrayAccesses += 2;
        
        trace.push({
          array: createArrayCopy(arrayCopy),
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, arrayAccesses },
          description: `Swapping elements ${arrayCopy[j + 1]} and ${arrayCopy[j]}`
        });
      }
    }
    
    // Mark the last element as sorted
    sortedIndices.push(len - i - 1);
    
    trace.push({
      array: createArrayCopy(arrayCopy),
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps, arrayAccesses },
      description: `Element at index ${len - i - 1} is now in its correct position`
    });
    
    // If no swapping occurred in this pass, the array is already sorted
    if (!swapped) {
      // Mark all remaining elements as sorted
      for (let k = 0; k < len - i - 1; k++) {
        if (!sortedIndices.includes(k)) {
          sortedIndices.push(k);
        }
      }
      
      trace.push({
        array: createArrayCopy(arrayCopy),
        sortedIndices: [...sortedIndices].sort((a, b) => a - b),
        stats: { comparisons, swaps, arrayAccesses },
        description: 'Array is already sorted, no more swaps needed'
      });
      
      break;
    }
  }
  
  return trace;
}

// Quick Sort
export function quickSort(array: number[]): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let sortedIndices: number[] = [];
  
  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: [],
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Starting quick sort algorithm'
  });
  
  quickSortHelper(arrayCopy, 0, arrayCopy.length - 1, trace, { comparisons, swaps, arrayAccesses }, sortedIndices);
  
  return trace;
}

function quickSortHelper(
  array: number[],
  low: number,
  high: number,
  trace: TraceStep[],
  stats: { comparisons: number, swaps: number, arrayAccesses: number },
  sortedIndices: number[]
): void {
  if (low < high) {
    const pivotIndex = partition(array, low, high, trace, stats, sortedIndices);
    
    // Mark pivot as sorted
    sortedIndices.push(pivotIndex);
    
    trace.push({
      array: createArrayCopy(array),
      currentIndices: [pivotIndex],
      sortedIndices: [...sortedIndices],
      stats: { ...stats },
      description: `Pivot element at index ${pivotIndex} is now in its correct position`
    });
    
    quickSortHelper(array, low, pivotIndex - 1, trace, stats, sortedIndices);
    quickSortHelper(array, pivotIndex + 1, high, trace, stats, sortedIndices);
  } else if (low >= 0 && high >= 0 && low === high) {
    // Single element is always sorted
    sortedIndices.push(low);
    
    trace.push({
      array: createArrayCopy(array),
      sortedIndices: [...sortedIndices],
      stats: { ...stats },
      description: `Element at index ${low} is now in its correct position`
    });
  }
}

function partition(
  array: number[],
  low: number,
  high: number,
  trace: TraceStep[],
  stats: { comparisons: number, swaps: number, arrayAccesses: number },
  sortedIndices: number[]
): number {
  // Choose the rightmost element as the pivot
  const pivot = array[high];
  stats.arrayAccesses++;
  
  trace.push({
    array: createArrayCopy(array),
    currentIndices: [high],
    sortedIndices: [...sortedIndices],
    stats: { ...stats },
    description: `Selected pivot: ${pivot} at index ${high}`
  });
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    stats.arrayAccesses++;
    stats.comparisons++;
    
    trace.push({
      array: createArrayCopy(array),
      currentIndices: [j],
      comparingIndices: [j, high],
      sortedIndices: [...sortedIndices],
      stats: { ...stats },
      description: `Comparing element at index ${j} with pivot ${pivot}`
    });
    
    if (array[j] <= pivot) {
      i++;
      
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
      stats.swaps++;
      stats.arrayAccesses += 2;
      
      if (i !== j) {
        trace.push({
          array: createArrayCopy(array),
          swappingIndices: [i, j],
          sortedIndices: [...sortedIndices],
          stats: { ...stats },
          description: `Swapping elements ${array[j]} and ${array[i]}`
        });
      }
    }
  }
  
  // Swap array[i+1] and array[high] (Put the pivot in its correct position)
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  stats.swaps++;
  stats.arrayAccesses += 2;
  
  trace.push({
    array: createArrayCopy(array),
    swappingIndices: [i + 1, high],
    sortedIndices: [...sortedIndices],
    stats: { ...stats },
    description: `Moving pivot to its correct position at index ${i + 1}`
  });
  
  return i + 1;
}

// Merge Sort
export function mergeSort(array: number[]): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let sortedIndices: number[] = [];
  
  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: [],
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Starting merge sort algorithm'
  });
  
  mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1, trace, { comparisons, swaps, arrayAccesses }, sortedIndices);
  
  // After sorting, all indices are sorted
  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: Array.from({ length: arrayCopy.length }, (_, i) => i),
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Merge sort completed'
  });
  
  return trace;
}

function mergeSortHelper(
  array: number[],
  left: number,
  right: number,
  trace: TraceStep[],
  stats: { comparisons: number, swaps: number, arrayAccesses: number },
  sortedIndices: number[]
): void {
  if (left >= right) {
    return;
  }
  
  const mid = Math.floor((left + right) / 2);
  
  trace.push({
    array: createArrayCopy(array),
    currentIndices: [mid],
    sortedIndices: [...sortedIndices],
    stats: { ...stats },
    description: `Splitting array between indices ${left} and ${right}`
  });
  
  mergeSortHelper(array, left, mid, trace, stats, sortedIndices);
  mergeSortHelper(array, mid + 1, right, trace, stats, sortedIndices);
  
  merge(array, left, mid, right, trace, stats, sortedIndices);
}

function merge(
  array: number[],
  left: number,
  mid: number,
  right: number,
  trace: TraceStep[],
  stats: { comparisons: number, swaps: number, arrayAccesses: number },
  sortedIndices: number[]
): void {
  const leftSize = mid - left + 1;
  const rightSize = right - mid;
  
  // Create temporary arrays
  const leftArray = new Array(leftSize);
  const rightArray = new Array(rightSize);
  
  // Copy data to temporary arrays
  for (let i = 0; i < leftSize; i++) {
    leftArray[i] = array[left + i];
    stats.arrayAccesses++;
  }
  
  for (let i = 0; i < rightSize; i++) {
    rightArray[i] = array[mid + 1 + i];
    stats.arrayAccesses++;
  }
  
  trace.push({
    array: createArrayCopy(array),
    currentIndices: [left, right],
    sortedIndices: [...sortedIndices],
    stats: { ...stats },
    description: `Merging subarrays between indices ${left} and ${right}`
  });
  
  // Merge the temporary arrays back into array[left..right]
  let i = 0, j = 0, k = left;
  
  while (i < leftSize && j < rightSize) {
    stats.comparisons++;
    stats.arrayAccesses += 2;
    
    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }
    
    stats.arrayAccesses++;
    
    trace.push({
      array: createArrayCopy(array),
      currentIndices: [k],
      sortedIndices: [...sortedIndices],
      stats: { ...stats },
      description: `Placing element ${array[k]} at index ${k}`
    });
    
    k++;
  }
  
  // Copy the remaining elements of leftArray, if there are any
  while (i < leftSize) {
    array[k] = leftArray[i];
    stats.arrayAccesses += 2;
    
    trace.push({
      array: createArrayCopy(array),
      currentIndices: [k],
      sortedIndices: [...sortedIndices],
      stats: { ...stats },
      description: `Copying remaining element ${array[k]} from left subarray to index ${k}`
    });
    
    i++;
    k++;
  }
  
  // Copy the remaining elements of rightArray, if there are any
  while (j < rightSize) {
    array[k] = rightArray[j];
    stats.arrayAccesses += 2;
    
    trace.push({
      array: createArrayCopy(array),
      currentIndices: [k],
      sortedIndices: [...sortedIndices],
      stats: { ...stats },
      description: `Copying remaining element ${array[k]} from right subarray to index ${k}`
    });
    
    j++;
    k++;
  }
  
  // Mark the merged section as sorted
  for (let i = left; i <= right; i++) {
    if (!sortedIndices.includes(i)) {
      sortedIndices.push(i);
    }
  }
}

// Insertion Sort
export function insertionSort(array: number[]): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let sortedIndices: number[] = [0]; // First element is already sorted
  
  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: [0],
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Starting insertion sort algorithm'
  });
  
  for (let i = 1; i < arrayCopy.length; i++) {
    let j = i;
    const currentElement = arrayCopy[i];
    arrayAccesses++;
    
    trace.push({
      array: createArrayCopy(arrayCopy),
      currentIndices: [i],
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps, arrayAccesses },
      description: `Inserting element ${currentElement} into the sorted portion`
    });
    
    while (j > 0 && arrayCopy[j - 1] > currentElement) {
      comparisons++;
      arrayAccesses++;
      
      arrayCopy[j] = arrayCopy[j - 1];
      arrayAccesses += 2;
      swaps++;
      
      trace.push({
        array: createArrayCopy(arrayCopy),
        currentIndices: [j - 1],
        swappingIndices: [j, j - 1],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, arrayAccesses },
        description: `Moving element ${arrayCopy[j - 1]} from index ${j - 1} to ${j}`
      });
      
      j--;
    }
    
    arrayCopy[j] = currentElement;
    arrayAccesses++;
    
    trace.push({
      array: createArrayCopy(arrayCopy),
      currentIndices: [j],
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps, arrayAccesses },
      description: `Placing element ${currentElement} at index ${j}`
    });
    
    // Update sorted indices
    sortedIndices.push(i);
    
    trace.push({
      array: createArrayCopy(arrayCopy),
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps, arrayAccesses },
      description: `Elements from index 0 to ${i} are now sorted`
    });
  }
  
  return trace;
}

// Selection Sort
export function selectionSort(array: number[]): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const arrayCopy = createArrayCopy(array);
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let sortedIndices: number[] = [];
  
  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: [],
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Starting selection sort algorithm'
  });
  
  for (let i = 0; i < arrayCopy.length - 1; i++) {
    let minIndex = i;
    
    trace.push({
      array: createArrayCopy(arrayCopy),
      currentIndices: [i],
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps, arrayAccesses },
      description: `Finding the minimum element to place at index ${i}`
    });
    
    for (let j = i + 1; j < arrayCopy.length; j++) {
      comparisons++;
      arrayAccesses += 2;
      
      trace.push({
        array: createArrayCopy(arrayCopy),
        currentIndices: [minIndex],
        comparingIndices: [j],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, arrayAccesses },
        description: `Comparing current minimum ${arrayCopy[minIndex]} with element ${arrayCopy[j]} at index ${j}`
      });
      
      if (arrayCopy[j] < arrayCopy[minIndex]) {
        minIndex = j;
        
        trace.push({
          array: createArrayCopy(arrayCopy),
          currentIndices: [minIndex],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, arrayAccesses },
          description: `Found new minimum ${arrayCopy[minIndex]} at index ${minIndex}`
        });
      }
    }
    
    if (minIndex !== i) {
      // Swap the found minimum element with the first element
      [arrayCopy[i], arrayCopy[minIndex]] = [arrayCopy[minIndex], arrayCopy[i]];
      swaps++;
      arrayAccesses += 2;
      
      trace.push({
        array: createArrayCopy(arrayCopy),
        swappingIndices: [i, minIndex],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, arrayAccesses },
        description: `Swapping elements ${arrayCopy[i]} and ${arrayCopy[minIndex]}`
      });
    }
    
    // Mark current position as sorted
    sortedIndices.push(i);
    
    trace.push({
      array: createArrayCopy(arrayCopy),
      sortedIndices: [...sortedIndices],
      stats: { comparisons, swaps, arrayAccesses },
      description: `Element ${arrayCopy[i]} is now in its correct position at index ${i}`
    });
  }
  
  // Mark the last element as sorted
  sortedIndices.push(arrayCopy.length - 1);
  
  trace.push({
    array: createArrayCopy(arrayCopy),
    sortedIndices: [...sortedIndices],
    stats: { comparisons, swaps, arrayAccesses },
    description: 'Selection sort completed'
  });
  
  return trace;
}
