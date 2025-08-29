import { useModel } from './App';

export default function PropsPanel() {
  const { byId, selectedId, setParent, rename, updatePrimitive, deleteNode, moveUp, moveDown } = useModel();

  if (!selectedId) {
    return (
      <div style={{ flex: 2, padding: 8, borderLeft: '1px solid #ddd' }}>
        <h4>Properties</h4>
        <div>No selection</div>
      </div>
    );
  }

  const node = byId[selectedId];
  if (!node) return null;

  // helper: collect all descendants of current node
  const collectDescendants = (id: string, acc: Set<string>) => {
    const n = byId[id];
    if (!n?.children) return;
    for (const cid of n.children) {
      acc.add(cid);
      collectDescendants(cid, acc);
    }
  };

  const invalidIds = new Set<string>([node.id]);
  collectDescendants(node.id, invalidIds);

  // only groups that are not the node itself or its descendants
  const groups = Object.values(byId).filter(
    n => n.children && !invalidIds.has(n.id)
  );

  return (
    <div style={{ flex: 2, padding: 8, borderLeft: '1px solid #ddd' }}>
      <h4>Properties</h4>

      <label style={{ display: 'block', marginBottom: 8 }}>
        <strong>Name:</strong>
        <input
          type="text"
          value={node.name}
          onChange={e => rename(node.id, e.target.value)}
          style={{ marginLeft: 6 }}
        />
      </label>

      <div><strong>ID:</strong> {node.id}</div>
      {node.id !== 'root' && (
        <div><strong>Type:</strong> {node.primitive ? node.primitive.type : '[Subassembly]'}</div>
      )}

      {node.id !== 'root' && (
        <label style={{ display: 'block', marginTop: 8 }}>
          <strong>Subassembly: </strong>
          <select
            value={node.parentId ?? ''}
            onChange={e => {
              const val = e.target.value || null;
              setParent(node.id, val);
            }}
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {node.primitive && (
        <div style={{ marginTop: 12 }}>
          <h4>Dimensions</h4>
          {node.primitive.type === 'box' && (
            <>
              <label>W: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.w}
                onChange={e => updatePrimitive(node.id, { w: parseFloat(e.target.value) || 0 })}
              /></label><br/>
              <label>H: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.h}
                onChange={e => updatePrimitive(node.id, { h: parseFloat(e.target.value) || 0 })}
              /></label><br/>
              <label>D: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.d}
                onChange={e => updatePrimitive(node.id, { d: parseFloat(e.target.value) || 0 })}
              /></label>
            </>
          )}
          {node.primitive.type === 'sphere' && (
            <label>R: <input
              type="number"
              step="0.1"
              min="0"
              value={node.primitive.r}
              onChange={e => updatePrimitive(node.id, { r: parseFloat(e.target.value) || 0 })}
            /></label>
          )}
          {node.primitive.type === 'cylinder' && (
            <>
              <label>Rt: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.rt}
                onChange={e => updatePrimitive(node.id, { rt: parseFloat(e.target.value) || 0 })}
              /></label><br/>
              <label>Rb: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.rb}
                onChange={e => updatePrimitive(node.id, { rb: parseFloat(e.target.value) || 0 })}
              /></label><br/>
              <label>H: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.h}
                onChange={e => updatePrimitive(node.id, { h: parseFloat(e.target.value) || 0 })}
              /></label>
            </>
          )}
          {node.primitive.type === 'cone' && (
            <>
              <label>R: <input
                type="number"
                step="0.1"
                value={node.primitive.r}
                onChange={e => updatePrimitive(node.id, { r: parseFloat(e.target.value) || 0 })}
              /></label><br/>
              <label>H: <input
                type="number"
                step="0.1"
                min="0"
                value={node.primitive.h}
                onChange={e => updatePrimitive(node.id, { h: parseFloat(e.target.value) || 0 })}
              /></label>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <div>
            <strong>Model Tree Location</strong>
        </div>
        {node.parentId && (
          <>
              <button
                onClick={() => moveUp(node.id)}
                style={{ marginTop: "6px", background: '#517ee8', color: 'white', padding: '6px 12px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                ↑ Move Up
              </button>
              <button
                onClick={() => moveDown(node.id)}
                style={{ marginLeft: '6px', background: '#517ee8', color: 'white', padding: '6px 12px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                ↓ Move Down
              </button>
          </>
        )}
        <button
          onClick={() => deleteNode(node.id)}
          style={{ marginTop: '12px', background: '#e74c3c', color: 'white', padding: '6px 12px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {node.id === 'root' ? 'Clear Root' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
