export default function ModelTree() {
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
        <div style={{ flex: 1, overflow: 'auto' }}>
        </div>
      </div>
    );
  }
  