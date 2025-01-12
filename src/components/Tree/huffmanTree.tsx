import { treeNode } from "@/huffman/encode";
import {
  Background,
  Controls,
  Edge,
  getIncomers,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./huffmanTree.css";
import { getLayoutedElements } from "./getLayoutetElements";
import { useCallback, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export function TreeBuilder({ node }: { node: treeNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // create all Node and Edge Objects

  const generate = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const generateNodesAndEdges = (node: treeNode, bin?: string) => {
      if (node.children.length == 0) {
        nodes.push({
          id: `node-${node.char}`,
          data: { label: node.char == " " ? "Space" : node.char, encoded: bin ?? ""},
          position: { x: 0, y: 0 },
          type: "output",
          style: {
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
          },
        });
      } else {
        nodes.push({
          id: `node-${node.char}`,
          data: { label: node.priority, encoded: bin },
          position: { x: 0, y: 0 },
          style: { width: 40, height: 40 },
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
        nodes[0].type = "input";
        generateNodesAndEdges(node.children[0], (bin ?? "")+"0");
        generateNodesAndEdges(node.children[1], (bin ?? "")+"1");
      }
    };
    generateNodesAndEdges(node);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes as Node[]);
    setEdges(layoutedEdges);
  }, [node, setEdges, setNodes]);

  const { fitView } = useReactFlow();

  useEffect(() => {
    generate();
    fitView();
  }, [fitView, generate]);

  // Position the Nodes

  const handleNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setHoveredNode(node);
      const nodeids: string[] = [];
      const getPreviousNode = (node: Node) => {
        nodeids.push(node.id);
        getIncomers(node, nodes, edges).map(getPreviousNode);
      };
      getPreviousNode(node);
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
      setHoveredNode(null);
      setNodes((nds) => nds.map((n) => ({ ...n, className: "default-node" })));
    },
    [setNodes]
  );


  return (
    <div
      data-tooltip-id="my-tooltip"
      data-tooltip-content={hoveredNode?.data.encoded as string}
      data-tooltip-float
      className="relative w-full h-full border-2 border-black"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        style={{ backgroundColor: "white" }}
        nodesConnectable={false}
      >
        <Background style={{ pointerEvents: "none" }} />
        <Controls />
      </ReactFlow>
      <Tooltip isOpen hidden={false} id="my-tooltip" />
    </div>
  );
}

export function Tree2({node}: {node: treeNode}) {
  return <ReactFlowProvider><TreeBuilder node={node}/></ReactFlowProvider>
}
