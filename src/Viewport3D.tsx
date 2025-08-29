import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import { useModel } from './App';
import type { Node } from './types';

function PrimitiveMesh({ node }: { node: Node }) {
  const p = node.primitive!;
  switch (p.type) {
    case 'box': return <mesh><boxGeometry args={[p.w, p.h, p.d]} /><meshStandardMaterial /></mesh>;
    case 'sphere': return <mesh><sphereGeometry args={[p.r, 32, 16]} /><meshStandardMaterial /></mesh>;
    case 'cylinder': return <mesh><cylinderGeometry args={[p.rt, p.rb, p.h, 32]} /><meshStandardMaterial /></mesh>;
    case 'cone': return <mesh><coneGeometry args={[p.r, p.h, 32]} /><meshStandardMaterial /></mesh>;
    default: return null;
  }
}

export default function Viewport3D() {
  const { byId, selectedId } = useModel();

  let renderNode: Node | null = null;
  if (selectedId) {
    const n = byId[selectedId];
    if (n?.primitive) renderNode = n;
  }

  return (
    <div style={{ flex: 6, borderRight: '1px solid #ddd' }}>
      <Canvas camera={{ position: [6, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <Grid args={[100, 100]} />
        {renderNode && <PrimitiveMesh node={renderNode} />}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
