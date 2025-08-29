export type Transform = {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  
  export type Primitive =
    | { type: 'box'; w: number; h: number; d: number }
    | { type: 'sphere'; r: number }
    | { type: 'cylinder'; rt: number; rb: number; h: number }
    | { type: 'cone'; r: number; h: number };
  
  export type Node = {
    id: string;
    name: string;
    parentId: string | null;
    transform: Transform;
    children?: string[];
    primitive?: Primitive;
  };
  