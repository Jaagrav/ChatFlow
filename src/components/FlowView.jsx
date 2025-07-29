import React, { useMemo, useEffect } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MessageNode from "./MessageNode";
import { useFlow } from "../contexts/FlowContext";
import toast from "react-hot-toast";

const styles = {
  background: "black",
  width: "100%",
  height: 300,
};

function FlowView() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedNode,
    selectedEdge,
    setSelectedNode,
    setSelectedEdge,
    saveFlow,
  } = useFlow();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        const success = saveFlow();
        if (success) {
          toast.success("Flow saved successfully!");
        } else {
          toast.error("Failed to save flow");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveFlow]);

  const onNodeClick = (event, node) => {
    console.log("node clicked", node);
    if (!selectedNode || selectedNode.id !== node.id) {
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  };

  const onEdgeClick = (event, edge) => {
    if (!selectedEdge || selectedEdge.id !== edge.id) {
      setSelectedEdge(edge);
    } else {
      setSelectedEdge(null);
    }
  };

  const onPaneClick = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const processedEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      style: {
        ...edge.style,
        stroke: selectedEdge?.id === edge.id ? "#fff" : "#666",
        strokeWidth: selectedEdge?.id === edge.id ? 2 : 1,
      },
      markerEnd: {
        ...edge.markerEnd,
        color: selectedEdge?.id === edge.id ? "#fff" : "#666",
      },
    }));
  }, [edges, selectedEdge]);

  const nodeTypes = {
    message: MessageNode,
  };

  return (
    <div className="h-full">
      <ReactFlow
        style={styles}
        nodes={nodes}
        edges={processedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: "arrow",
          style: { stroke: "#666", strokeWidth: 1 },
          markerEnd: {
            type: "arrowclosed",
            width: 12,
            height: 12,
            color: "#666",
          },
        }}
      >
        <Background color="#616161" gap={16} />
      </ReactFlow>
    </div>
  );
}

export default FlowView;
