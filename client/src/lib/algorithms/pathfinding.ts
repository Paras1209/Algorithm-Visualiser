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

// Dijkstra's Algorithm
export function dijkstra(graph: Graph): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const { nodes, edges } = graph;
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  
  // Choose a start node (first node)
  const startNodeId = 0;
  const endNodeId = nodes.length - 1;
  
  // Initialize distances
  const distances = new Array(nodes.length).fill(Infinity);
  distances[startNodeId] = 0;
  
  // Initialize previous nodes for path reconstruction
  const previous = new Array(nodes.length).fill(null);
  
  // Initialize visited nodes
  const visited = new Array(nodes.length).fill(false);
  
  // Create adjacency list
  const adjacencyList = createAdjacencyList(nodes, edges);
  
  trace.push({
    graph: { ...graph },
    currentIndices: [startNodeId],
    stats: { comparisons, swaps, arrayAccesses },
    description: `Starting Dijkstra's algorithm from node ${nodes[startNodeId].label}`
  });
  
  for (let i = 0; i < nodes.length; i++) {
    // Find the node with the minimum distance
    let minDistance = Infinity;
    let minIndex = -1;
    
    for (let j = 0; j < nodes.length; j++) {
      comparisons++;
      
      if (!visited[j] && distances[j] < minDistance) {
        minDistance = distances[j];
        minIndex = j;
      }
    }
    
    // No reachable nodes left
    if (minIndex === -1) break;
    
    // Mark the node as visited
    visited[minIndex] = true;
    
    // Create array of visited nodes for visualization
    const visitedIndices = visited
      .map((isVisited, index) => isVisited ? index : -1)
      .filter(index => index !== -1);
    
    // Reconstruct path to current node
    const pathIndices = reconstructPath(previous, minIndex);
    
    trace.push({
      graph: { ...graph },
      currentIndices: [minIndex],
      visitedIndices,
      pathIndices,
      stats: { comparisons, swaps, arrayAccesses },
      description: `Visiting node ${nodes[minIndex].label} with distance ${distances[minIndex]}`
    });
    
    // If reached the target node, we're done
    if (minIndex === endNodeId) {
      trace.push({
        graph: { ...graph },
        currentIndices: [endNodeId],
        visitedIndices,
        pathIndices: reconstructPath(previous, endNodeId),
        stats: { comparisons, swaps, arrayAccesses },
        description: `Reached target node ${nodes[endNodeId].label} with total distance ${distances[endNodeId]}`
      });
      break;
    }
    
    // Update distances to neighbors
    if (adjacencyList[minIndex]) {
      for (const { neighbor, weight } of adjacencyList[minIndex]) {
        arrayAccesses += 2;
        comparisons++;
        
        const alt = distances[minIndex] + weight;
        
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = minIndex;
          
          trace.push({
            graph: { ...graph },
            currentIndices: [minIndex],
            comparingIndices: [neighbor],
            visitedIndices,
            pathIndices: reconstructPath(previous, neighbor),
            stats: { comparisons, swaps, arrayAccesses },
            description: `Updated distance to node ${nodes[neighbor].label} to ${alt}`
          });
        } else {
          trace.push({
            graph: { ...graph },
            currentIndices: [minIndex],
            comparingIndices: [neighbor],
            visitedIndices,
            pathIndices,
            stats: { comparisons, swaps, arrayAccesses },
            description: `Kept existing distance to node ${nodes[neighbor].label} as ${distances[neighbor]}`
          });
        }
      }
    }
  }
  
  return trace;
}

// A* Search Algorithm
export function aStar(graph: Graph): AlgorithmTrace {
  const trace: TraceStep[] = [];
  const { nodes, edges } = graph;
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  
  // Choose a start and end node
  const startNodeId = 0;
  const endNodeId = nodes.length - 1;
  
  // Create adjacency list
  const adjacencyList = createAdjacencyList(nodes, edges);
  
  // Initialize open and closed sets
  const openSet = [startNodeId];
  const closedSet: number[] = [];
  
  // Initialize g and f scores
  const gScore = new Array(nodes.length).fill(Infinity);
  gScore[startNodeId] = 0;
  
  const fScore = new Array(nodes.length).fill(Infinity);
  fScore[startNodeId] = heuristic(nodes[startNodeId], nodes[endNodeId]);
  
  // Initialize previous nodes for path reconstruction
  const previous = new Array(nodes.length).fill(null);
  
  trace.push({
    graph: { ...graph },
    currentIndices: [startNodeId],
    stats: { comparisons, swaps, arrayAccesses },
    description: `Starting A* search from node ${nodes[startNodeId].label} to ${nodes[endNodeId].label}`
  });
  
  while (openSet.length > 0) {
    // Find the node in the open set with the lowest f score
    let lowestIndex = 0;
    
    for (let i = 1; i < openSet.length; i++) {
      comparisons++;
      
      if (fScore[openSet[i]] < fScore[openSet[lowestIndex]]) {
        lowestIndex = i;
      }
    }
    
    const current = openSet[lowestIndex];
    
    // If we reached the end node
    if (current === endNodeId) {
      // Reconstruct path
      const path = reconstructPath(previous, current);
      
      trace.push({
        graph: { ...graph },
        currentIndices: [current],
        visitedIndices: [...closedSet, ...openSet],
        pathIndices: path,
        stats: { comparisons, swaps, arrayAccesses },
        description: `Reached target node ${nodes[endNodeId].label} with total cost ${gScore[endNodeId]}`
      });
      
      break;
    }
    
    // Remove current from open set and add to closed set
    openSet.splice(lowestIndex, 1);
    closedSet.push(current);
    
    trace.push({
      graph: { ...graph },
      currentIndices: [current],
      visitedIndices: closedSet,
      pathIndices: reconstructPath(previous, current),
      stats: { comparisons, swaps, arrayAccesses },
      description: `Exploring node ${nodes[current].label} with f-score ${fScore[current]}`
    });
    
    // Process each neighbor
    if (adjacencyList[current]) {
      for (const { neighbor, weight } of adjacencyList[current]) {
        arrayAccesses++;
        
        // Skip if neighbor is in closed set
        if (closedSet.includes(neighbor)) {
          comparisons++;
          continue;
        }
        
        // Calculate tentative g score
        const tentativeGScore = gScore[current] + weight;
        
        // If not in open set, add it
        const isNewPath = !openSet.includes(neighbor);
        if (isNewPath) {
          openSet.push(neighbor);
        }
        
        // This path is better, record it
        comparisons++;
        if (tentativeGScore < gScore[neighbor]) {
          previous[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + heuristic(nodes[neighbor], nodes[endNodeId]);
          
          trace.push({
            graph: { ...graph },
            currentIndices: [current],
            comparingIndices: [neighbor],
            visitedIndices: closedSet,
            pathIndices: reconstructPath(previous, neighbor),
            stats: { comparisons, swaps, arrayAccesses },
            description: `${isNewPath ? 'Discovered' : 'Updated'} node ${nodes[neighbor].label} with g-score=${tentativeGScore}, f-score=${fScore[neighbor]}`
          });
        }
      }
    }
  }
  
  // If we exit the loop without finding a path
  if (!closedSet.includes(endNodeId)) {
    trace.push({
      graph: { ...graph },
      visitedIndices: closedSet,
      stats: { comparisons, swaps, arrayAccesses },
      description: `No path found from node ${nodes[startNodeId].label} to ${nodes[endNodeId].label}`
    });
  }
  
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

function reconstructPath(previous: (number | null)[], current: number): number[] {
  const path: number[] = [current];
  let temp = current;
  
  while (previous[temp] !== null) {
    temp = previous[temp] as number;
    path.unshift(temp);
  }
  
  return path;
}

function heuristic(a: Node, b: Node): number {
  // Euclidean distance heuristic
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
