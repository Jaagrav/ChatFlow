import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";

const STORAGE_KEY = "chatflow-saved-flow";

const initialState = {
  nodes: [
    {
      id: "n1",
      position: { x: 0, y: 0 },
      data: { label: "Node 1", message: "Hello, how are you?" },
      type: "message",
    },
    {
      id: "n2",
      position: { x: 300, y: 100 },
      data: { label: "Node 2", message: "I'm good, thank you!" },
      type: "message",
    },
  ],
  edges: [
    {
      id: "n1-n2",
      source: "n1",
      target: "n2",
      type: "arrow",
      style: { strokeWidth: 1 },
      markerEnd: {
        type: "arrowclosed",
        width: 12,
        height: 12,
      },
    },
  ],
  selectedNode: null,
  selectedEdge: null,
  isEditing: false,
  flowName: "Flow",
  lastSaved: null,
};

const FLOW_ACTIONS = {
  SET_NODES: "SET_NODES",
  SET_EDGES: "SET_EDGES",
  UPDATE_NODES: "UPDATE_NODES",
  UPDATE_EDGES: "UPDATE_EDGES",
  ADD_NODE: "ADD_NODE",
  ADD_EDGE: "ADD_EDGE",
  DELETE_NODE: "DELETE_NODE",
  DELETE_EDGE: "DELETE_EDGE",
  SET_SELECTED_NODE: "SET_SELECTED_NODE",
  SET_SELECTED_EDGE: "SET_SELECTED_EDGE",
  SET_EDITING: "SET_EDITING",
  SET_FLOW_NAME: "SET_FLOW_NAME",
  SET_LAST_SAVED: "SET_LAST_SAVED",
  RESET_FLOW: "RESET_FLOW",
  LOAD_FLOW: "LOAD_FLOW",
};

const flowReducer = (state, action) => {
  switch (action.type) {
    case FLOW_ACTIONS.SET_NODES:
      return { ...state, nodes: action.payload };

    case FLOW_ACTIONS.SET_EDGES:
      return { ...state, edges: action.payload };

    case FLOW_ACTIONS.UPDATE_NODES:
      return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) };

    case FLOW_ACTIONS.UPDATE_EDGES:
      return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };

    case FLOW_ACTIONS.ADD_NODE:
      return { ...state, nodes: [...state.nodes, action.payload] };

    case FLOW_ACTIONS.ADD_EDGE:
      return { ...state, edges: addEdge(action.payload, state.edges) };

    case FLOW_ACTIONS.DELETE_NODE:
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter(
          (edge) =>
            edge.source !== action.payload && edge.target !== action.payload
        ),
      };

    case FLOW_ACTIONS.DELETE_EDGE:
      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.payload),
      };

    case FLOW_ACTIONS.SET_SELECTED_NODE:
      return { ...state, selectedNode: action.payload };

    case FLOW_ACTIONS.SET_SELECTED_EDGE:
      return { ...state, selectedEdge: action.payload };

    case FLOW_ACTIONS.SET_EDITING:
      return { ...state, isEditing: action.payload };

    case FLOW_ACTIONS.SET_FLOW_NAME:
      return { ...state, flowName: action.payload };

    case FLOW_ACTIONS.SET_LAST_SAVED:
      return { ...state, lastSaved: action.payload };

    case FLOW_ACTIONS.RESET_FLOW:
      return { ...initialState, flowName: state.flowName };

    case FLOW_ACTIONS.LOAD_FLOW:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  // Load saved flow from localStorage on component mount
  useEffect(() => {
    const savedFlow = localStorage.getItem(STORAGE_KEY);
    if (savedFlow) {
      try {
        const parsedFlow = JSON.parse(savedFlow);
        dispatch({ type: FLOW_ACTIONS.LOAD_FLOW, payload: parsedFlow });
      } catch (error) {
        console.error("Error loading saved flow:", error);
      }
    }
  }, []);

  const setNodes = useCallback((nodes) => {
    dispatch({ type: FLOW_ACTIONS.SET_NODES, payload: nodes });
  }, []);

  const setEdges = useCallback((edges) => {
    dispatch({ type: FLOW_ACTIONS.SET_EDGES, payload: edges });
  }, []);

  const onNodesChange = useCallback((changes) => {
    dispatch({ type: FLOW_ACTIONS.UPDATE_NODES, payload: changes });
  }, []);

  const onEdgesChange = useCallback((changes) => {
    dispatch({ type: FLOW_ACTIONS.UPDATE_EDGES, payload: changes });
  }, []);

  const onConnect = useCallback((params) => {
    dispatch({ type: FLOW_ACTIONS.ADD_EDGE, payload: params });
  }, []);

  const addNode = useCallback((node) => {
    dispatch({ type: FLOW_ACTIONS.ADD_NODE, payload: node });
  }, []);

  const deleteNode = useCallback((nodeId) => {
    dispatch({ type: FLOW_ACTIONS.DELETE_NODE, payload: nodeId });
  }, []);

  const deleteEdge = useCallback((edgeId) => {
    dispatch({ type: FLOW_ACTIONS.DELETE_EDGE, payload: edgeId });
  }, []);

  const setSelectedNode = useCallback((node) => {
    dispatch({ type: FLOW_ACTIONS.SET_SELECTED_NODE, payload: node });
  }, []);

  const setSelectedEdge = useCallback((edge) => {
    dispatch({ type: FLOW_ACTIONS.SET_SELECTED_EDGE, payload: edge });
  }, []);

  const setEditing = useCallback((isEditing) => {
    dispatch({ type: FLOW_ACTIONS.SET_EDITING, payload: isEditing });
  }, []);

  const setFlowName = useCallback((name) => {
    dispatch({ type: FLOW_ACTIONS.SET_FLOW_NAME, payload: name });
  }, []);

  const setLastSaved = useCallback((timestamp) => {
    dispatch({ type: FLOW_ACTIONS.SET_LAST_SAVED, payload: timestamp });
  }, []);

  const resetFlow = useCallback(() => {
    dispatch({ type: FLOW_ACTIONS.RESET_FLOW });
  }, []);

  const saveFlow = useCallback(() => {
    try {
      const flowData = {
        nodes: state.nodes,
        edges: state.edges,
        flowName: state.flowName,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowData));
      setLastSaved(new Date().toISOString());

      console.log("Flow saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving flow:", error);
      return false;
    }
  }, [state.nodes, state.edges, state.flowName, setLastSaved]);

  const loadFlow = useCallback(() => {
    try {
      const savedFlow = localStorage.getItem(STORAGE_KEY);
      if (savedFlow) {
        const parsedFlow = JSON.parse(savedFlow);
        dispatch({ type: FLOW_ACTIONS.LOAD_FLOW, payload: parsedFlow });
        console.log("Flow loaded successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading flow:", error);
      return false;
    }
  }, []);

  const clearSavedFlow = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Saved flow cleared");
      return true;
    } catch (error) {
      console.error("Error clearing saved flow:", error);
      return false;
    }
  }, []);

  const value = {
    ...state,

    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    deleteEdge,
    setSelectedNode,
    setSelectedEdge,
    setEditing,
    setFlowName,
    setLastSaved,
    resetFlow,
    saveFlow,
    loadFlow,
    clearSavedFlow,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};
