import { useModel } from './App';

export default function PropsPanel() {
  const { byId, selectedId, setParent } = useModel();

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

  // groups = all nodes with children array (so groups & root)
  const groups = Object.values(byId).filter(n => n.children);

  return (
    <div style={{ flex: 2, padding: 8, borderLeft: '1px solid #ddd' }}>
      <h4>Properties</h4>

      <div><strong>Name:</strong> {node.name}</div>
      <div><strong>ID:</strong> {node.id}</div>
      <div><strong>Type:</strong> {node.primitive ? node.primitive.type : '[Group]'}</div>

      {node.id !== 'root' && (
        <label style={{ display: 'block', marginTop: 8 }}>
          Subassembly:
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
    </div>
  );
}
