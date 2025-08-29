import { createContext, useContext, useMemo, useState } from 'react';
import type { Node, Primitive, Transform } from './types';
import Viewport3D from './Viewport3D';
import ModelTree from './ModelTree';
import PropsPanel from './PropsPanel';
import NameModal from './NameModal';

type ModelCtx = {
  byId: Record<string, Node>;
  setById: React.Dispatch<React.SetStateAction<Record<string, Node>>>;
  rootId: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addPrimitive: (p: Primitive) => void;
  addGroup: () => void;
  setParent: (id: string, newParentId: string | null) => void;
  rename: (id: string, newName: string) => void;
  updatePrimitive: (id: string, patch: Partial<Primitive>) => void;
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

  const [pending, setPending] = useState<null | { type: 'primitive' | 'group'; payload: any }>(null);

  const isGroup = (n?: Node) => !!n && n.children !== undefined;

  const finalizeAdd = (name: string) => {
    if (!pending) return;
    const newId = nid();
    setById(prev => {
      const selected = selectedId ? prev[selectedId] : undefined;
      const parentId = (selected && isGroup(selected)) ? selected.id : rootId;
      const parent = prev[parentId];

      if (pending.type === 'primitive') {
        const p = pending.payload as Primitive;
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
      } else {
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
      }
    });
    setSelectedId(newId);
    setPending(null);
  };

  const addPrimitive = (p: Primitive) => {
    setPending({ type: 'primitive', payload: p });
  };

  const addGroup = () => {
    setPending({ type: 'group', payload: null });
  };

  const setParent: ModelCtx['setParent'] = (id, newParentId) => {
    setById(prev => {
      const node = prev[id];
      if (!node) return prev;
      const oldParentId = node.parentId;
      const next = { ...prev };

      if (oldParentId && next[oldParentId]) {
        next[oldParentId] = {
          ...next[oldParentId],
          children: (next[oldParentId].children ?? []).filter(cid => cid !== id)
        };
      }

      next[id] = { ...node, parentId: newParentId };

      if (newParentId && next[newParentId]) {
        next[newParentId] = {
          ...next[newParentId],
          children: [...(next[newParentId].children ?? []), id]
        };
      }

      return next;
    });
  };

  const rename: ModelCtx['rename'] = (id, newName) => {
    setById(prev => {
      const n = prev[id];
      if (!n) return prev;
      return { ...prev, [id]: { ...n, name: newName } };
    });
  };

  const updatePrimitive: ModelCtx['updatePrimitive'] = (id, patch) => {
    setById(prev => {
      const n = prev[id];
      if (!n?.primitive) return prev;
      return {
        ...prev,
        [id]: { ...n, primitive: { ...n.primitive, ...patch } as Primitive }
      };
    });
  };

  const api = useMemo<ModelCtx>(() => ({
    byId, setById, rootId, selectedId, setSelectedId,
    addPrimitive, addGroup, setParent, rename, updatePrimitive
  }), [byId, selectedId]);

  return (
    <ModelContext.Provider value={api}>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'system-ui, sans-serif' }}>
        <ModelTree />
        <Viewport3D />
        <PropsPanel />
      </div>
      {pending && (
        <NameModal
          suggested={pending.type === 'primitive' ? pending.payload.type : 'Subassembly'}
          onSubmit={finalizeAdd}
          onCancel={() => setPending(null)}
        />
      )}
    </ModelContext.Provider>
  );
}
