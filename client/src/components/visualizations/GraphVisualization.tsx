import { useEffect, useRef } from "react";
import * as d3 from "d3";

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

type GraphData = {
  nodes: Node[];
  edges: Edge[];
};

type GraphVisualizationProps = {
  graph?: GraphData;
  currentIndices?: number[];
  comparingIndices?: number[];
  visitedIndices?: number[];
  pathIndices?: number[];
};

export function GraphVisualization({
  graph,
  currentIndices = [],
  comparingIndices = [],
  visitedIndices = [],
  pathIndices = []
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!graph || !svgRef.current) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // Create a simulation for positioning nodes
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Prepare the data
    const nodes = graph.nodes.map(node => ({...node}));
    const links = graph.edges.map(edge => ({
      ...edge,
      source: edge.source,
      target: edge.target
    }));
    
    // Function to determine node color based on its state
    const getNodeColor = (d: Node) => {
      if (currentIndices.includes(d.id)) return "var(--color-green-500)";
      if (comparingIndices.includes(d.id)) return "var(--color-accent-500)";
      if (pathIndices.includes(d.id)) return "var(--color-accent-500)";
      if (visitedIndices.includes(d.id)) return "var(--color-secondary-500)";
      return "var(--color-primary-500)";
    };
    
    // Function to determine link color
    const getLinkColor = (d: any) => {
      if (pathIndices.includes(d.source.id) && pathIndices.includes(d.target.id)) {
        // Check if these nodes are adjacent in the path
        const sourceIndex = pathIndices.indexOf(d.source.id);
        const targetIndex = pathIndices.indexOf(d.target.id);
        if (Math.abs(sourceIndex - targetIndex) === 1) {
          return "var(--color-accent-500)";
        }
      }
      return "#ccc";
    };

    // Create the links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", 2)
      .attr("stroke", getLinkColor);
    
    // Create the link labels (weights)
    const linkLabel = svg.append("g")
      .selectAll("text")
      .data(links)
      .enter().append("text")
      .text(d => d.weight)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#666");
    
    // Create the nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 15)
      .attr("fill", getNodeColor)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Create the node labels
    const nodeLabel = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text(d => d.label)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#fff")
      .attr("pointer-events", "none");
    
    // Update node and link positions
    simulation.nodes(nodes).on("tick", ticked);
    (simulation.force("link") as d3.ForceLink<any, any>).links(links);
    
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
      
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
      
      nodeLabel
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    }
    
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return () => {
      // Clean up the simulation
      simulation.stop();
    };
  }, [graph, currentIndices, comparingIndices, visitedIndices, pathIndices]);
  
  if (!graph) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400">
        <p>No graph data to visualize</p>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}

export default GraphVisualization;
