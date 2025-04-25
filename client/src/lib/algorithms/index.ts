import { bubbleSort, quickSort, mergeSort, insertionSort, selectionSort } from './sorting';
import { binarySearch, linearSearch } from './searching';
import { dijkstra, aStar } from './pathfinding';
import { bfs, dfs } from './graph';

export type AlgorithmStep = {
  type: string;
  description: string;
  indices: number[];
  snapshot?: any;
};

export type TraceStep = {
  array?: number[];
  graph?: any;
  currentIndices?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  visitedIndices?: number[];
  pathIndices?: number[];
  stats: {
    comparisons: number;
    swaps: number;
    arrayAccesses: number;
  };
  description: string;
};

export type AlgorithmTrace = TraceStep[];

export type AlgorithmFunction = (input: any) => AlgorithmTrace;

export type AlgorithmType = 'sorting' | 'searching' | 'pathfinding' | 'graph';

export interface Algorithm {
  id: number;
  name: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string;
  explanation: string[];
  bestCase?: string;
  averageCase?: string;
  worstCase?: string;
  type: AlgorithmType;
  execute: AlgorithmFunction;
  generateInput: (size: number, type: string) => any;
}

// Export algorithms grouped by type
export const sortingAlgorithms: Algorithm[] = [
  {
    id: 1,
    name: 'Bubble Sort',
    category: 'Sorting',
    description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: 
`procedure bubbleSort(A: list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
    explanation: [
      'Repeatedly step through the list to be sorted',
      'Compare each pair of adjacent items',
      'Swap the items if they are in the wrong order',
      'Continue until no more swaps are needed'
    ],
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    type: 'sorting',
    execute: bubbleSort,
    generateInput: generateRandomArray
  },
  {
    id: 2,
    name: 'Quick Sort',
    category: 'Sorting',
    description: 'A divide-and-conquer sorting algorithm that picks an element as a pivot and partitions the array around the pivot.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    pseudocode: 
`function quickSort(arr, low, high)
    if low < high then
        pivot = partition(arr, low, high)
        quickSort(arr, low, pivot - 1)
        quickSort(arr, pivot + 1, high)
    end if
end function

function partition(arr, low, high)
    pivot = arr[high]
    i = low - 1
    for j = low to high - 1 do
        if arr[j] <= pivot then
            i = i + 1
            swap arr[i] with arr[j]
        end if
    end for
    swap arr[i + 1] with arr[high]
    return i + 1
end function`,
    explanation: [
      'Choose a pivot element from the array',
      'Partition the array around the pivot (elements less than pivot to the left, greater to the right)',
      'Recursively apply the above steps to the sub-arrays',
      'The base case is arrays of size zero or one, which are already sorted'
    ],
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    type: 'sorting',
    execute: quickSort,
    generateInput: generateRandomArray
  },
  {
    id: 3,
    name: 'Merge Sort',
    category: 'Sorting',
    description: 'A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pseudocode: 
`function mergeSort(arr)
    if length(arr) <= 1 then
        return arr
    end if
    
    mid = length(arr) / 2
    left = mergeSort(arr[0...mid-1])
    right = mergeSort(arr[mid...length(arr)-1])
    
    return merge(left, right)
end function

function merge(left, right)
    result = []
    i = 0, j = 0
    
    while i < length(left) and j < length(right) do
        if left[i] <= right[j] then
            append left[i] to result
            i = i + 1
        else
            append right[j] to result
            j = j + 1
        end if
    end while
    
    append remaining elements of left to result
    append remaining elements of right to result
    
    return result
end function`,
    explanation: [
      'Divide the unsorted array into n sub-arrays, each containing one element',
      'Repeatedly merge sub-arrays to produce new sorted sub-arrays',
      'Continue until there is only one sub-array remaining',
      'Merging is done by comparing the first elements of both sub-arrays and taking the smaller one'
    ],
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    type: 'sorting',
    execute: mergeSort,
    generateInput: generateRandomArray
  },
  {
    id: 4,
    name: 'Insertion Sort',
    category: 'Sorting',
    description: 'A simple sorting algorithm that builds the final sorted array one item at a time. It is efficient for small data sets.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: 
`function insertionSort(arr)
    for i = 1 to length(arr) - 1 do
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key do
            arr[j + 1] = arr[j]
            j = j - 1
        end while
        
        arr[j + 1] = key
    end for
end function`,
    explanation: [
      'Iterate through the array starting from the second element',
      'For each element, compare it with the previous elements',
      'Move greater elements one position ahead to make space for the current element',
      'Insert the current element in its correct position in the sorted part'
    ],
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    type: 'sorting',
    execute: insertionSort,
    generateInput: generateRandomArray
  },
  {
    id: 5,
    name: 'Selection Sort',
    category: 'Sorting',
    description: 'A simple comparison-based sorting algorithm that divides the input into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    pseudocode: 
`function selectionSort(arr)
    n = length(arr)
    for i = 0 to n - 2 do
        minIndex = i
        for j = i + 1 to n - 1 do
            if arr[j] < arr[minIndex] then
                minIndex = j
            end if
        end for
        swap arr[i] with arr[minIndex]
    end for
end function`,
    explanation: [
      'Divide the array into a sorted (initially empty) and an unsorted region',
      'Find the minimum element in the unsorted region',
      'Swap it with the first element of the unsorted region',
      'Move the boundary between the regions one element to the right'
    ],
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    type: 'sorting',
    execute: selectionSort,
    generateInput: generateRandomArray
  }
];

export const searchingAlgorithms: Algorithm[] = [
  {
    id: 6,
    name: 'Binary Search',
    category: 'Searching',
    description: 'An efficient search algorithm that finds the position of a target value within a sorted array.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    pseudocode: 
`function binarySearch(arr, target)
    left = 0
    right = length(arr) - 1
    
    while left <= right do
        mid = (left + right) / 2
        
        if arr[mid] == target then
            return mid
        else if arr[mid] < target then
            left = mid + 1
        else
            right = mid - 1
        end if
    end while
    
    return -1 // Not found
end function`,
    explanation: [
      'Compare the target value to the middle element of the array',
      'If they are equal, return the middle position',
      'If the target is less than the middle element, search the left half',
      'If the target is greater than the middle element, search the right half',
      'Repeat until the target is found or the search space is empty'
    ],
    bestCase: 'O(1)',
    averageCase: 'O(log n)',
    worstCase: 'O(log n)',
    type: 'searching',
    execute: binarySearch,
    generateInput: generateSortedArray
  },
  {
    id: 7,
    name: 'Linear Search',
    category: 'Searching',
    description: 'A simple search algorithm that checks each element of the list until the target element is found or the list ends.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: 
`function linearSearch(arr, target)
    for i = 0 to length(arr) - 1 do
        if arr[i] == target then
            return i
        end if
    end for
    
    return -1 // Not found
end function`,
    explanation: [
      'Start from the first element of the array',
      'Compare each element with the target value',
      'If the element is found, return its position',
      'If the array is completely traversed without finding the target, return -1'
    ],
    bestCase: 'O(1)',
    averageCase: 'O(n/2)',
    worstCase: 'O(n)',
    type: 'searching',
    execute: linearSearch,
    generateInput: generateRandomArray
  }
];

export const pathfindingAlgorithms: Algorithm[] = [
  {
    id: 8,
    name: 'Dijkstra\'s Algorithm',
    category: 'Pathfinding',
    description: 'An algorithm that finds the shortest paths between nodes in a weighted graph.',
    timeComplexity: 'O((V+E)log V)',
    spaceComplexity: 'O(V)',
    pseudocode: 
`function dijkstra(graph, source)
    dist = array of size |V| initialized to infinity
    dist[source] = 0
    priority_queue Q
    Q.insert(source, 0)
    
    while Q is not empty do
        u = Q.extract_min()
        
        for each neighbor v of u do
            alt = dist[u] + length(u, v)
            if alt < dist[v] then
                dist[v] = alt
                Q.decrease_key(v, alt)
            end if
        end for
    end while
    
    return dist
end function`,
    explanation: [
      'Initialize distances of all vertices as infinite and the source as zero',
      'Create a priority queue and insert the source',
      'While the queue is not empty, extract the minimum distance vertex',
      'For each adjacent vertex, update its distance if a shorter path is found',
      'Insert updated vertices back into the queue'
    ],
    bestCase: 'O((V+E)log V)',
    averageCase: 'O((V+E)log V)',
    worstCase: 'O((V+E)log V)',
    type: 'pathfinding',
    execute: dijkstra,
    generateInput: generateGraph
  },
  {
    id: 9,
    name: 'A* Search',
    category: 'Pathfinding',
    description: 'A best-first search algorithm that finds the shortest path from a start node to a goal node using a heuristic function.',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    pseudocode: 
`function a_star(graph, start, goal)
    open_set = {start}
    came_from = empty map
    g_score = map with default value of infinity
    g_score[start] = 0
    f_score = map with default value of infinity
    f_score[start] = heuristic(start, goal)
    
    while open_set is not empty do
        current = node in open_set with lowest f_score
        if current = goal then
            return reconstruct_path(came_from, current)
        end if
        
        open_set.remove(current)
        for each neighbor of current do
            tentative_g_score = g_score[current] + d(current, neighbor)
            if tentative_g_score < g_score[neighbor] then
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
                if neighbor not in open_set then
                    open_set.add(neighbor)
                end if
            end if
        end for
    end while
    
    return failure
end function`,
    explanation: [
      'Maintain two sets: open (nodes to be evaluated) and closed (already evaluated nodes)',
      'Start with the initial node in the open set',
      'For each iteration, select the node with the lowest f(n) = g(n) + h(n)',
      'g(n) is the cost from the start to the current node',
      'h(n) is the heuristic estimated cost from the current node to the goal',
      'Continue until the goal is reached or the open set is empty'
    ],
    bestCase: 'O(E)',
    averageCase: 'O(E)',
    worstCase: 'O(E)',
    type: 'pathfinding',
    execute: aStar,
    generateInput: generateGraph
  }
];

export const graphAlgorithms: Algorithm[] = [
  {
    id: 10,
    name: 'BFS',
    category: 'Graph',
    description: 'Breadth-First Search is an algorithm for traversing or searching tree or graph data structures, starting at a given vertex and exploring all neighbors before moving to the next level.',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    pseudocode: 
`function bfs(graph, start)
    queue = [start]
    visited = {start}
    
    while queue is not empty do
        vertex = queue.dequeue()
        
        for each neighbor of vertex do
            if neighbor not in visited then
                visited.add(neighbor)
                queue.enqueue(neighbor)
            end if
        end for
    end while
end function`,
    explanation: [
      'Start at a given vertex and mark it as visited',
      'Visit all adjacent unvisited vertices and mark them as visited',
      'Use a queue to keep track of vertices to visit next',
      'Continue until the queue is empty (all reachable vertices have been visited)'
    ],
    bestCase: 'O(V+E)',
    averageCase: 'O(V+E)',
    worstCase: 'O(V+E)',
    type: 'graph',
    execute: bfs,
    generateInput: generateGraph
  },
  {
    id: 11,
    name: 'DFS',
    category: 'Graph',
    description: 'Depth-First Search is an algorithm for traversing or searching tree or graph data structures, starting at a given vertex and exploring as far as possible along each branch before backtracking.',
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    pseudocode: 
`function dfs(graph, start)
    visited = {}
    
    function dfs_visit(vertex)
        visited.add(vertex)
        
        for each neighbor of vertex do
            if neighbor not in visited then
                dfs_visit(neighbor)
            end if
        end for
    end function
    
    dfs_visit(start)
end function`,
    explanation: [
      'Start at a given vertex and mark it as visited',
      'Recursively visit all adjacent unvisited vertices',
      'Use a stack (typically through recursion) to keep track of vertices to visit',
      'Backtrack when a vertex has no unvisited adjacent vertices'
    ],
    bestCase: 'O(V+E)',
    averageCase: 'O(V+E)',
    worstCase: 'O(V+E)',
    type: 'graph',
    execute: dfs,
    generateInput: generateGraph
  }
];

export const allAlgorithms: Algorithm[] = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
  ...pathfindingAlgorithms,
  ...graphAlgorithms
];

function generateRandomArray(size: number, type: string = 'random'): number[] {
  const array = Array.from({ length: size }, (_, i) => i + 1);
  
  switch (type) {
    case 'random':
      return array.sort(() => Math.random() - 0.5);
    case 'nearly-sorted':
      // Create a nearly sorted array by swapping a few elements
      for (let i = 0; i < size * 0.1; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
      }
      return array;
    case 'reversed':
      return array.reverse();
    case 'few-unique':
      return Array.from({ length: size }, () => Math.floor(Math.random() * 5) + 1);
    default:
      return array.sort(() => Math.random() - 0.5);
  }
}

function generateSortedArray(size: number): { array: number[], target: number } {
  const array = Array.from({ length: size }, (_, i) => i + 1);
  const targetIndex = Math.floor(Math.random() * size);
  return { array, target: array[targetIndex] };
}

function generateGraph(size: number = 10): { nodes: any[], edges: any[] } {
  const nodes = Array.from({ length: size }, (_, i) => ({
    id: i,
    label: String.fromCharCode(65 + i),
    x: Math.random() * 800,
    y: Math.random() * 600
  }));
  
  const edges = [];
  // Create a connected graph
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (Math.random() > 0.7) {
        edges.push({
          source: i,
          target: j,
          weight: Math.floor(Math.random() * 10) + 1
        });
      }
    }
  }
  
  // Ensure graph is connected
  for (let i = 1; i < size; i++) {
    const hasConnection = edges.some(e => 
      (e.source === i && e.target < i) || 
      (e.target === i && e.source < i)
    );
    
    if (!hasConnection) {
      const target = Math.floor(Math.random() * i);
      edges.push({
        source: i,
        target,
        weight: Math.floor(Math.random() * 10) + 1
      });
    }
  }
  
  return { nodes, edges };
}

export function getAlgorithmById(id: number): Algorithm | undefined {
  return allAlgorithms.find(algo => algo.id === id);
}

export function getAlgorithmsByType(type: AlgorithmType): Algorithm[] {
  return allAlgorithms.filter(algo => algo.type === type);
}
