import { treeNode } from "@/huffman/encode";
import {
  Background,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import '@xyflow/react/dist/style.css';



const nodeWidth = 150;
const nodeHeight = 50;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {...node, width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).-
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

export function Tree2({ node }: { node: treeNode }) {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const generateNodesAndEdges = (node: treeNode) => {
    if (node.children.length == 0) {
      initialNodes.push({
        id: `node-${node.char}`,
        data: { label: node.char },
        position: { x: 0, y: 0 },
        type: "output"
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
      });
      initialEdges.push({
        id: `edge-${node.char}-${node.children[1].char}`,
        source: `node-${node.char}`,
        target: `node-${node.children[1].char}`,
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

  const [testN, setNodes, onNodesChange] = useNodesState(layoutedNodes as Node[]);
  const [testE, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  return (
      <ReactFlow
        nodes={testN}
        edges={testE}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={{ backgroundColor: "white" }}
      >
        <Background style={{ pointerEvents: "none" }} />
      </ReactFlow>
  );
}

