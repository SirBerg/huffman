import { treeNode } from "@/huffman/encode";
import {
  Background,
  Edge,
  getIncomers,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import "./huffmanTree.css"
import { getLayoutedElements } from "./getLayoutetElements";
import { useCallback, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export function Tree2({ node }: { node: treeNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  
  // create all Node and Edge Objects
  
   const generate = useCallback(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const generateNodesAndEdges = (node: treeNode) => {
      if (node.children.length == 0) {
        nodes.push({
          id: `node-${node.char}`,
          data: { label: node.char },
          position: { x: 0, y: 0 },
          type: "output",
        });
      } else {
        nodes.push({
          id: `node-${node.char}`,
          data: { label: node.priority },
          position: { x: 0, y: 0 },
        });
        edges.push({
          id: `edge-${node.char}-${node.children[0].char}`,
          source: `node-${node.char}`,
          target: `node-${node.children[0].char}`,
          animated: true,
        });
        edges.push({
          id: `edge-${node.char}-${node.children[1].char}`,
          source: `node-${node.char}`,
          target: `node-${node.children[1].char}`,
          animated: true,
        });
        nodes[0].type = "input"
        generateNodesAndEdges(node.children[0]);
        generateNodesAndEdges(node.children[1]);
      }
    };
    generateNodesAndEdges(node)
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes as Node[])
    setEdges(layoutedEdges)
    console.log("inrender")
  }, [node, setEdges, setNodes])
  
  useEffect(() => {
    generate()
  }, [generate])


  // Position the Nodes
  



  const handleNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setHoveredNode(node)
      const nodeids: string[] = []
      const getPreviousNode = (node: Node) => {
        nodeids.push(node.id)
        getIncomers(node, nodes, edges).map(getPreviousNode)
      } 
      getPreviousNode(node)
      setNodes((nds) =>
        nds.map((n) =>
          nodeids.includes(n.id) ? { ...n, className: "hovered-node" } : n
        )
      );
    },
    [edges, nodes, setNodes]
  );


  const handleNodeMouseLeave = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: React.MouseEvent, node: Node) => {
      setHoveredNode(null)
      setNodes((nds) =>
        nds.map((n) => ({ ...n, className: "default-node" })
          
        )
      );
    },
    [setNodes]
  );

  const tooltipContent = hoveredNode?.id ?? ""

  return (
    <div data-tooltip-id="my-tooltip" data-tooltip-content={tooltipContent}  data-tooltip-float className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        fitView
        style={{ backgroundColor: "white" }}
        nodesConnectable = {false}
        className=""
      >
        <Background style={{ pointerEvents: "none" }} />
      </ReactFlow>
      <Tooltip isOpen hidden={false} id="my-tooltip" />
    </div>
  );
}

