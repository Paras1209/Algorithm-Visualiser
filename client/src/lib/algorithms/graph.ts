import { AlgorithmTrace, TraceStep } from './index';

// Simulated graph structure
type Node = {
  id: number;
  label: string;
  x: number;
  y: number;
};

type Edge = {
  source: number;
  target: number;
  weight: number;
};

type Graph = {
  nodes: Node[];
  edges: Edge[];
};

// Breadth-First Search
export function bfs(graph: Graph): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const { nodes, edges } = graph;
  let comparisons = 0;
  let arrayAccesses = 0;
  
  // Create adjacency list
  const adjacencyList = createAdjacencyList(nodes, edges);
  
  // Choose a start node (first node)
  const startNodeId = 0;
  
  // Initialize visited array
  const visited = new Array(nodes.length).fill(false);
  
  // Initialize queue with start node
  const queue: number[] = [startNodeId];
  visited[startNodeId] = true;
  
  trace.push({
    graph: { ...graph },
    currentIndices: [startNodeId],
    visitedIndices: [startNodeId],
    stats: { comparisons, swaps: 0, arrayAccesses },
    description: `Starting BFS from node ${nodes[startNodeId].label}`
  });
  
  while (queue.length > 0) {
    // Dequeue a node
    const current = queue.shift()!;
    arrayAccesses++;
    
    // Get all visited nodes for visualization
    const visitedIndices = visited
      .map((isVisited, index) => isVisited ? index : -1)
      .filter(index => index !== -1);
    
    trace.push({
      graph: { ...graph },
      currentIndices: [current],
      visitedIndices,
      stats: { comparisons, swaps: 0, arrayAccesses },
      description: `Processing node ${nodes[current].label}`
    });
    
    // Process neighbors
    if (adjacencyList[current]) {
      for (const { neighbor } of adjacencyList[current]) {
        comparisons++;
        
        if (!visited[neighbor]) {
          queue.push(neighbor);
          visited[neighbor] = true;
          
          trace.push({
            graph: { ...graph },
            currentIndices: [current],
            comparingIndices: [neighbor],
            visitedIndices: [...visitedIndices, neighbor],
            stats: { comparisons, swaps: 0, arrayAccesses },
            description: `Discovered new node ${nodes[neighbor].label} from ${nodes[current].label}`
          });
        } else {
          trace.push({
            graph: { ...graph },
            currentIndices: [current],
            comparingIndices: [neighbor],
            visitedIndices: visitedIndices,
            stats: { comparisons, swaps: 0, arrayAccesses },
            description: `Node ${nodes[neighbor].label} already visited`
          });
        }
      }
    }
  }
  
  const allVisitedIndices = visited
    .map((isVisited, index) => isVisited ? index : -1)
    .filter(index => index !== -1);
  
  trace.push({
    graph: { ...graph },
    visitedIndices: allVisitedIndices,
    stats: { comparisons, swaps: 0, arrayAccesses },
    description: `BFS completed, visited ${allVisitedIndices.length} nodes`
  });
  
  return trace;
}

// Depth-First Search
export function dfs(graph: Graph): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const { nodes, edges } = graph;
  let comparisons = 0;
  let arrayAccesses = 0;
  
  // Create adjacency list
  const adjacencyList = createAdjacencyList(nodes, edges);
  
  // Choose a start node (first node)
  const startNodeId = 0;
  
  // Initialize visited array
  const visited = new Array(nodes.length).fill(false);
  
  trace.push({
    graph: { ...graph },
    currentIndices: [startNodeId],
    stats: { comparisons, swaps: 0, arrayAccesses },
    description: `Starting DFS from node ${nodes[startNodeId].label}`
  });
  
  function dfsRecursive(nodeId: number) {
    // Mark node as visited
    visited[nodeId] = true;
    arrayAccesses++;
    
    // Get all visited nodes for visualization
    const visitedIndices = visited
      .map((isVisited, index) => isVisited ? index : -1)
      .filter(index => index !== -1);
    
    trace.push({
      graph: { ...graph },
      currentIndices: [nodeId],
      visitedIndices,
      stats: { comparisons, swaps: 0, arrayAccesses },
      description: `Visiting node ${nodes[nodeId].label}`
    });
    
    // Process neighbors
    if (adjacencyList[nodeId]) {
      for (const { neighbor } of adjacencyList[nodeId]) {
        comparisons++;
        
        if (!visited[neighbor]) {
          trace.push({
            graph: { ...graph },
            currentIndices: [nodeId],
            comparingIndices: [neighbor],
            visitedIndices,
            stats: { comparisons, swaps: 0, arrayAccesses },
            description: `Exploring unvisited neighbor ${nodes[neighbor].label} from ${nodes[nodeId].label}`
          });
          
          dfsRecursive(neighbor);
        } else {
          trace.push({
            graph: { ...graph },
            currentIndices: [nodeId],
            comparingIndices: [neighbor],
            visitedIndices,
            stats: { comparisons, swaps: 0, arrayAccesses },
            description: `Node ${nodes[neighbor].label} already visited`
          });
        }
      }
    }
  }
  
  dfsRecursive(startNodeId);
  
  const allVisitedIndices = visited
    .map((isVisited, index) => isVisited ? index : -1)
    .filter(index => index !== -1);
  
  trace.push({
    graph: { ...graph },
    visitedIndices: allVisitedIndices,
    stats: { comparisons, swaps: 0, arrayAccesses },
    description: `DFS completed, visited ${allVisitedIndices.length} nodes`
  });
  
  return trace;
}

// Helper Functions

function createAdjacencyList(nodes: Node[], edges: Edge[]) {
  const adjacencyList: {[key: number]: {neighbor: number, weight: number}[]} = {};
  
  edges.forEach(edge => {
    if (!adjacencyList[edge.source]) {
      adjacencyList[edge.source] = [];
    }
    adjacencyList[edge.source].push({ neighbor: edge.target, weight: edge.weight });
    
    // For undirected graphs, add the reverse edge as well
    if (!adjacencyList[edge.target]) {
      adjacencyList[edge.target] = [];
    }
    adjacencyList[edge.target].push({ neighbor: edge.source, weight: edge.weight });
  });
  
  return adjacencyList;
}
