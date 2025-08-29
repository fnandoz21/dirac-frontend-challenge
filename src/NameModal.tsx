import { useState } from 'react';

export default function NameModal({
  suggested,
  onSubmit,
  onCancel
}: {
  suggested: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(suggested);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'grey',
        padding: 20,
        borderRadius: 8,
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <h4>Name this {suggested}</h4>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onSubmit(value.trim() || suggested)}>OK</button>
        </div>
      </div>
    </div>
  );
}
