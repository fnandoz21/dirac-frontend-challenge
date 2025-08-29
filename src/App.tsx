import { createContext, useContext, useMemo, useState } from 'react';
import type { Node, Primitive, Transform } from './types';
import Viewport3D from './Viewport3D';
import ModelTree from './ModelTree';
import PropsPanel from './PropsPanel';

type ModelCtx = {
  byId: Record<string, Node>;
  setById: React.Dispatch<React.SetStateAction<Record<string, Node>>>;
  rootId: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addPrimitive: (p: Primitive) => void;
  addGroup: () => void;
  setParent: (id: string, newParentId: string | null) => void;
};

const ModelContext = createContext<ModelCtx | null>(null);
export const useModel = () => useContext(ModelContext)!;

const defT = (): Transform => ({ position: [0,0,0], rotation:[0,0,0], scale:[1,1,1] });
const nid = () => Math.random().toString(36).slice(2,9);

export default function App() {
  const rootId = 'root';
  const [byId, setById] = useState<Record<string, Node>>({
    [rootId]: { id: rootId, name: 'Root', parentId: null, transform: defT(), children: [] }
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // a "group" is any node with children array (root or subassembly)
  const isGroup = (n?: Node) => !!n && n.children !== undefined;

  const addPrimitive: ModelCtx['addPrimitive'] = (p) => {
    const newId = nid();
    const name = p.type;

    setById(prev => {
      const selected = selectedId ? prev[selectedId] : undefined;
      const parentId = (selected && isGroup(selected)) ? selected.id : rootId;
      const parent = prev[parentId];

      const newNode: Node = {
        id: newId,
        name,
        parentId: parent.id,
        transform: defT(),
        primitive: p
      };
      return {
        ...prev,
        [newId]: newNode,
        [parent.id]: { ...parent, children: [...(parent.children ?? []), newId] }
      };
    });

    setSelectedId(newId);
  };

  const addGroup: ModelCtx['addGroup'] = () => {
    const newId = nid();
    const name = 'Subassembly';

    setById(prev => {
      const selected = selectedId ? prev[selectedId] : undefined;
      const parentId = (selected && isGroup(selected)) ? selected.id : rootId;
      const parent = prev[parentId];

      const newGroup: Node = {
        id: newId,
        name,
        parentId: parent.id,
        transform: defT(),
        children: []
      };
      return {
        ...prev,
        [newId]: newGroup,
        [parent.id]: { ...parent, children: [...(parent.children ?? []), newId] }
      };
    });

    setSelectedId(newId);
  };

  const setParent: ModelCtx['setParent'] = (id, newParentId) => {
    setById(prev => {
      const node = prev[id];
      if (!node) return prev;
      const oldParentId = node.parentId;
      const next = { ...prev };

      // remove from old parent
      if (oldParentId && next[oldParentId]) {
        next[oldParentId] = {
          ...next[oldParentId],
          children: (next[oldParentId].children ?? []).filter(cid => cid !== id)
        };
      }

      // update node
      next[id] = { ...node, parentId: newParentId };

      // add to new parent
      if (newParentId && next[newParentId]) {
        next[newParentId] = {
          ...next[newParentId],
          children: [...(next[newParentId].children ?? []), id]
        };
      }

      return next;
    });
  };

  const api = useMemo<ModelCtx>(() => ({
    byId, setById, rootId, selectedId, setSelectedId,
    addPrimitive, addGroup, setParent
  }), [byId, selectedId]);

  return (
    <ModelContext.Provider value={api}>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'system-ui, sans-serif' }}>
        <ModelTree />
        <Viewport3D />
        <PropsPanel />
      </div>
    </ModelContext.Provider>
  );
}
