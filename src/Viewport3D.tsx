import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';

export default function Viewport3D() {
  return (
    <div style={{
        flex: 6,
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Canvas camera={{ position: [6, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <Grid args={[100, 100]} />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
