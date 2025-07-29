import { Handle, Position } from "@xyflow/react";
import { FiMessageSquare } from "react-icons/fi";
import { useFlow } from "../contexts/FlowContext";

function MessageNode({ id = null, isPreview = false, data }) {
  const { selectedNode } = useFlow();

  const isSelected = selectedNode?.id === id;

  return (
    <div
      className={`shadow-md rounded-md bg-black border-1 min-w-48 p-1 transition-all duration-200 ${
        isSelected ? "border-blue-500 shadow-blue-500/20" : "border-stone-800"
      }`}
    >
      <div className="text-stone-300 bg-teal-600/20 px-2 py-1 text-xs flex items-center gap-1 rounded-sm">
        <FiMessageSquare />
        <span>Send Message</span>
      </div>
      <div className="flex p-2">
        {data.message ? (
          <div className="text-white">{data.message}</div>
        ) : (
          <div className="text-stone-600">Select to enter message</div>
        )}
      </div>

      {!isPreview && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="w-24 !bg-white"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="w-16 !bg-white"
          />
        </>
      )}
    </div>
  );
}

export default MessageNode;
