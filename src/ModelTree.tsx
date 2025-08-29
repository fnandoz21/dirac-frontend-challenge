import { useModel } from './App';
import type { Node } from './types';

function TreeItem({ node }: { node: Node }) {
  const { byId, selectedId, setSelectedId } = useModel();
  const isSelected = selectedId === node.id;

  const label = node.id === 'root'
    ? `${node.name}`
    : node.primitive
        ? `${node.name} (${node.primitive.type})`
        : `${node.name} [Subassembly]`;

  return (
    <div style={{ marginLeft: node.parentId ? 12 : 0 }}>
      <div
        onClick={() => setSelectedId(node.id)}
        style={{
          padding: '4px 6px',
          borderRadius: 6,
          cursor: 'pointer',
          background: isSelected ? '#517ee8' : 'transparent',
          fontWeight: isSelected ? 600 : 400
        }}
        title={node.id}
      >
        {label}
      </div>
      {(node.children ?? []).map(cid => (
        <TreeItem key={cid} node={byId[cid]} />
      ))}
    </div>
  );
}

export default function ModelTree() {
  const { byId, rootId, addPrimitive, addGroup } = useModel();
  const root = byId[rootId];

  const addBox = () => addPrimitive({ type: 'box', w: 1, h: 1, d: 1 });
  const addSphere = () => addPrimitive({ type: 'sphere', r: 0.75 });
  const addCylinder = () => addPrimitive({ type: 'cylinder', rt: 0.5, rb: 0.5, h: 1.5 });
  const addCone = () => addPrimitive({ type: 'cone', r: 0.6, h: 1.2 });

  return (
    <div
      style={{
        flex: 2,
        borderRight: '1px solid #ddd',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h4>Model Tree</h4>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <button onClick={addGroup}>+ Subassembly</button>
        <button onClick={addBox}>+ Box</button>
        <button onClick={addSphere}>+ Sphere</button>
        <button onClick={addCylinder}>+ Cylinder</button>
        <button onClick={addCone}>+ Cone</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <TreeItem node={root} />
      </div>
    </div>
  );
}
