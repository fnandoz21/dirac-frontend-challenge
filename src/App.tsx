import Viewport3D from './Viewport3D';
import ModelTree from './ModelTree';
import PropsPanel from './PropsPanel';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'system-ui, sans-serif' }}>
      <ModelTree />
      <Viewport3D />
      <PropsPanel />
    </div>
  );
}
