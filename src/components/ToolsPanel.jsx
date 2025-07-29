import { useState, useEffect } from "react";
import { useFlow } from "../contexts/FlowContext";
import MessageNode from "./MessageNode";
import { FiPlus, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";

function ToolsPanel() {
  const {
    addNode,
    selectedNode,
    setSelectedNode,
    nodes,
    setNodes,
    saveFlow,
    edges,
  } = useFlow();
  const [message, setMessage] = useState("");

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      position: { x: 100, y: 100 },
      data: { label: "New Node", message: "New message" },
      type: "message",
    };

    addNode(newNode);
  };

  const saveChanges = (e) => {
    const newMessage = message;

    const updatedSelectedNode = {
      ...selectedNode,
      data: { ...selectedNode.data, message: newMessage },
    };
    setSelectedNode(updatedSelectedNode);

    const updatedNodes = nodes.map((node) =>
      node.id === selectedNode.id
        ? { ...node, data: { ...node.data, message: newMessage } }
        : node
    );
    setNodes(updatedNodes);
    setSelectedNode(null);

    toast.success("Message saved successfully!");
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const validateFlow = () => {
    if (nodes.length <= 1) return true;

    const nodesWithTargets = new Set();
    edges.forEach((edge) => {
      nodesWithTargets.add(edge.target);
    });

    const orphanNodes = nodes.filter((node) => !nodesWithTargets.has(node.id));

    if (orphanNodes.length > 1) {
      toast.error(
        `Cannot save: ${orphanNodes.length} orphan nodes detected. Connect all nodes to save.`
      );
      return false;
    }

    return true;
  };

  const handleSaveFlow = () => {
    if (!validateFlow()) {
      return;
    }

    const success = saveFlow();
    if (success) {
      toast.success("Flow saved successfully!");
    } else {
      toast.error("Failed to save flow");
    }
  };

  useEffect(() => {
    setMessage(selectedNode?.data?.message);
  }, [selectedNode]);

  return (
    <div className="h-full w-full">
      {!selectedNode && (
        <div className="flex flex-col h-full">
          <div className="flex flex-col">
            <div className="text-white border-b border-stone-800 p-2">
              Tools
            </div>
            <div className="p-2">
              <div className="flex flex-col">
                <div className="w-full">
                  <MessageNode
                    isPreview={true}
                    data={{ label: "New Node", message: "New message" }}
                  />
                </div>
                <button
                  className="text-white flex flex-row gap-2 items-center cursor-pointer border-l border-r border-b border-stone-800 p-2 rounded-b-md -mt-1 hover:bg-stone-800/50"
                  onClick={handleAddNode}
                >
                  <FiPlus className="text-lg" />
                  <span className="text-sm">Add Node</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 mt-auto w-full">
            <button
              className="bg-white flex flex-row gap-2 items-center cursor-pointer border border-stone-800 p-2 rounded-md w-full justify-center hover:bg-stone-100"
              onClick={handleSaveFlow}
            >
              <FiSave className="text-sm" />
              <span className="text-sm text-black">Save Flow</span>
            </button>
          </div>
        </div>
      )}
      {selectedNode && (
        <div className="flex flex-col h-full">
          <div className="text-white border-b border-stone-800 p-2">
            Editing Message
          </div>
          <div className="p-2 h-full flex flex-col">
            <input
              value={message}
              onChange={handleMessageChange}
              className="bg-black border-1 border-stone-800 p-2 rounded-md text-white"
              type="text"
              placeholder="Enter your message here"
              autoFocus
            />
            <button
              className="bg-white flex flex-row gap-2 items-center cursor-pointer border-l border-r border-b border-stone-800 p-2 rounded-md -mt-1 mt-auto"
              onClick={saveChanges}
            >
              <FiSave className="text-lg" />
              <span className="text-sm text-black">Save Message</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsPanel;
