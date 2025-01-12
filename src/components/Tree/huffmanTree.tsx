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
import { useCallback } from "react";

export function Tree2({ node }: { node: treeNode }) {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const generateNodesAndEdges = (node: treeNode) => {
    if (node.children.length == 0) {
      initialNodes.push({
        id: `node-${node.char}`,
        data: { label: node.char },
        position: { x: 0, y: 0 },
        type: "output",
      });
    } else {
      initialNodes.push({
        id: `node-${node.char}`,
        data: { label: node.priority },
        position: { x: 0, y: 0 },
      });
      initialEdges.push({
        id: `edge-${node.char}-${node.children[0].char}`,
        source: `node-${node.char}`,
        target: `node-${node.children[0].char}`,
        animated: true,
      });
      initialEdges.push({
        id: `edge-${node.char}-${node.children[1].char}`,
        source: `node-${node.char}`,
        target: `node-${node.children[1].char}`,
        animated: true,
      });
      initialNodes[0].type = "input"
      generateNodesAndEdges(node.children[0]);
      generateNodesAndEdges(node.children[1]);
    }
  };
  generateNodesAndEdges(node);
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const handleNodeMouseEnter = useCallback(
    (event, node: Node) => {
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
    [setNodes]
  );

  const handleNodeMouseLeave = useCallback(
    (event, node: Node) => {
      
      setNodes((nds) =>
        nds.map((n) => ({ ...n, className: "default-node" })
          
        )
      );
    },
    [setNodes]
  );
  
  return (
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
      >
        <Background style={{ pointerEvents: "none" }} />
      </ReactFlow>
  );
}

